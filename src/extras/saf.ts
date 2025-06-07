import * as fs from 'node:fs';
import type { BunFile } from 'bun';
import { path } from 'bunmagic';

/**
 * Swiss Army File manager
 */
export class SAF {
	/**
	 * Safe mode ensures that when the file is moved or renamed,
	 * it will not overwrite an existing file at the destination.
	 */
	public safeMode = true;

	/**
	 * How to separate the base name from the iteration number
	 */
	public safeSeparator = '_';

	/**
	 * You can change various properties of the file,
	 * but they won't be be applied until you call `update()`.
	 */
	#dirty: string | false = false;

	/**
	 * The absolute path to the file
	 */
	#abspath: string;

	constructor(handle: string) {
		this.#abspath = path.resolve(handle);
	}

	/**
	 * Get a SAF instance from a target path
	 */
	public static from(dir: string, target: string): SAF;
	public static from(target: string): SAF;
	public static from(a: string, b?: string): SAF {
		const dir = b === undefined ? undefined : a;
		let target = b === undefined ? a : b;

		if (dir) {
			return new SAF(path.resolve(resolveTilde(dir), target));
		}

		if (target.startsWith('~')) {
			target = resolveTilde(target);
		}

		return new SAF(target);
	}

	/**
	 * Prepare a target path for writing
	 */
	public static async prepare(target: string) {
		const destination = SAF.from(target);
		if (await destination.file.exists()) {
			const safeTarget = await destination.getSafePath(target);
			destination.#abspath = safeTarget;
		}

		return destination;
	}

	/**
	 *
	 * - Utilities
	 *
	 */

	/**
	 * `/path/to/file.txt` -> `file`
	 */
	get base(): string | undefined {
		return path.basename(this.#abspath, this.extension);
	}

	set base(value: string) {
		this.#dirty = path.join(this.directory, value + this.extension);
	}

	/**
	 * `/path/to/file.txt` -> `file.txt`
	 */
	get name(): string | undefined {
		return path.basename(this.#abspath);
	}

	set name(value: string) {
		this.#dirty = path.join(this.directory, value + this.extension);
	}

	/**
	 * `/path/to/file.txt` -> `/path/to`
	 */
	get directory(): string {
		return path.dirname(this.#abspath);
	}

	set directory(value: string) {
		this.#dirty = path.join(value, this.base + this.extension);
	}

	/**
	 * `/path/to/file.txt` -> `.txt`
	 */
	get extension(): string {
		return path.extname(this.#abspath);
	}

	set extension(value: string) {
		this.#dirty = path.join(this.directory, this.base + value);
	}

	/**
	 * `/path/to/file.txt`
	 */
	get path(): string {
		return this.#abspath;
	}

	set path(value: string) {
		this.#dirty = value;
	}

	/**
	 * Get the Bun file instance
	 */
	get file(): BunFile {
		return Bun.file(this.#abspath);
	}

	public unsafe() {
		this.safeMode = false;
		return this;
	}

	public safe() {
		this.safeMode = true;
		return this;
	}

	/**
	 * Quickly read/write JSON
	 */
	public async json<T = unknown>(data?: T): Promise<T> {
		if (data === undefined) {
			return this.file.json() as Promise<T>;
		}

		await this.write(JSON.stringify(data, null, 2));
		return data;
	}

	public async update() {
		if (this.#dirty === this.#abspath) {
			return this;
		}

		if (this.#dirty) {
			if (this.#abspath === '') {
				throw new Error(`Can't update deleted file`);
			}

			const destination = this.safeMode ? await SAF.prepare(this.#dirty) : SAF.from(this.#dirty);

			if ((await this.exists()) !== false) {
				const bytes = await this.bytes();
				const copy = await Bun.write(destination.path, bytes);
				if (copy === bytes.length) {
					await this.delete();
				}
			}

			this.#abspath = destination.path;
			this.#dirty = false;
		}

		return this;
	}

	public async exists(): Promise<boolean> {
		if (this.#abspath === '') {
			return false;
		}

		if (await this.file.exists()) {
			return true;
		}

		return this.isDirectory();
	}

	public async isFile(): Promise<boolean> {
		return (await this.exists()) && (await this.isDirectory()) === false;
	}

	public async isDirectory(): Promise<boolean> {
		// Bun currently doesn't support checking directories,
		// This kind of works, but there are too many unknown unknowns:
		// Const file = Bun.file(path);
		// return file.size > 0 && file.type === 'application/octet-stream';
		return new Promise((resolve, reject) => {
			fs.stat(this.path, (error, stats) => {
				if (error) {
					if (error.code === 'ENOENT') {
						resolve(false);
					} else {
						reject(error);
					}
				} else {
					resolve(stats.isDirectory());
				}
			});
		});
	}

	public async write(
		input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile,
	) {
		return Bun.write(this.file, input);
	}

	public async bytes(): Promise<Uint8Array> {
		return new Uint8Array(await this.file.arrayBuffer());
	}

	public async delete(postDelete: 'clear_handle' | 'keep_handle' = 'clear_handle') {
		if (await this.file.exists()) {
			fs.unlinkSync(this.#abspath);
		}

		if (postDelete === 'clear_handle') {
			this.#abspath = '';
		}

		return this;
	}

	public async ensureDirectory() {
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(this.directory, { recursive: true }, error => {
				if (error) {
					reject(new Error(`Couldn't create directory: ${this.directory}`));
				} else {
					resolve();
				}
			});
		});
	}

	public async edit(callback: (content: string) => string | Promise<string>) {
		const content = await this.file.text();
		await this.write(await callback(content));
		return this;
	}

	/**
	 *
	 * - Serialization
	 *
	 */
	public toString(): string {
		return this.path;
	}

	// Called when the object is used in a string context
	public valueOf(): string {
		return this.path;
	}

	/**
	 * Generates a safe filename by appending a number if the file already exists
	 * @param newPath The desired new path
	 * @returns A safe path that doesn't exist
	 */
	private async getSafePath(newPath: string): Promise<string> {
		const saf = SAF.from(newPath);
		if (!saf.base) {
			throw new Error(`Couldn't get base name for ${newPath}`);
		}

		if ((await saf.exists()) === false) {
			return saf.path;
		}

		let iteration = 0;
		const originalBase = saf.base;
		let destination = saf.path;
		while (destination && (await Bun.file(destination).exists())) {
			iteration++;
			if (iteration > 10) {
				throw new Error(`Failed to find a safe path for ${newPath}`);
			}

			saf.base = `${originalBase}${saf.safeSeparator}${iteration}`;
			destination = saf.#dirty || saf.path;
		}

		return destination;
	}
}
