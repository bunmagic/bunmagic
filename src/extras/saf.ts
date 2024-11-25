import * as fs from 'node:fs';
import type { BunFile } from 'bun';

/**
 * Swiss Army File manager
 */
export class SAF {
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

	public static async prepare(target: string) {
		const destination = SAF.from(target);
		if (await destination.file.exists()) {
			const safeTarget = await destination.getSafePath(target);
			destination.#handle = safeTarget;
		}

		return destination;
	}


	public safeMode = true;
	public separator = '_';
	#dirty: string | false = false;
	#handle: string;

	constructor(handle: string) {
		this.#handle = path.resolve(handle);
	}

	get base(): string | undefined {
		return path.basename(this.#handle, this.extension);
	}

	set base(value: string) {
		this.#dirty = path.join(this.directory, value + this.extension);
	}

	get name(): string | undefined {
		return path.basename(this.#handle);
	}

	set name(value: string) {
		this.#dirty = path.join(this.directory, value + this.extension);
	}

	get extension(): string {
		return path.extname(this.#handle);
	}

	set extension(value: string) {
		this.#dirty = path.join(this.directory, this.base + value);
	}

	get path(): string {
		return this.#handle;
	}

	set path(value: string) {
		this.#dirty = value;
	}

	get file(): BunFile {
		return Bun.file(this.#handle);
	}

	get directory(): string {
		return path.dirname(this.#handle);
	}

	set directory(value: string) {
		this.#dirty = path.join(value, this.base + this.extension);
	}


	public unsafe() {
		this.safeMode = false;
		return this;
	}

	public safe() {
		this.safeMode = true;
		return this;
	}


	public async json<T = unknown>(data?: T): Promise<T> {
		if (data === undefined) {
			return this.file.json() as Promise<T>;
		}

		await this.write(JSON.stringify(data, null, 2));
		return data;
	}

	public async update() {
		if (this.#dirty === this.#handle) {
			return this;
		}

		if (this.#dirty) {
			if (this.#handle === '') {
				throw new Error(`Can't update deleted file`);
			}

			const destination = this.safeMode ?
				await SAF.prepare(this.#dirty)
				: SAF.from(this.#dirty);

			if (await this.exists() !== false) {
				await Bun.write(destination.path, this.file);
			}

			this.#handle = destination.path;
			this.#dirty = false;
		}

		return this;
	}

	public async exists() {
		if (this.#handle === '') {
			return false;
		}

		if (await this.file.exists()) {
			return true;
		}

		return this.isDirectory();
	}

	public async write(input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile) {
		return Bun.write(this.file, input);
	}


	public async bytes(): Promise<Uint8Array> {
		return new Uint8Array(await this.file.arrayBuffer());
	}

	public async delete(postDelete: 'clear_handle' | 'keep_handle' = 'clear_handle') {
		if (await this.file.exists()) {
			fs.unlinkSync(this.#handle);
		}

		if (postDelete === 'clear_handle') {
			this.#handle = '';
		}

		return this;
	}

	public toString(): string {
		return this.path;
	}

	public async isDirectory() {
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
	 * Generates a safe filename by appending a number if the file already exists
	 * @param newPath The desired new path
	 * @returns A safe path that doesn't exist
	 */
	private async getSafePath(newPath: string): Promise<string> {
		const saf = SAF.from(newPath);
		if (!saf.base) {
			throw new Error(`Couldn't get base name for ${newPath}`);
		}

		if (await saf.exists() === false) {
			return saf.path;
		}

		let iteration = 0;
		const originalBase = saf.base;
		let destination = saf.path;
		while (destination && await Bun.file(destination).exists()) {
			iteration++;
			if (iteration > 10) {
				throw new Error(`Failed to find a safe path for ${newPath}`);
			}

			saf.base = `${originalBase}${saf.separator}${iteration}`;
			destination = saf.#dirty || saf.path;
		}

		return destination;
	}
}
