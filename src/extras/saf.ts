import * as fs from 'node:fs';
import type { BunFile } from 'bun';


/**
 * Swiss Army File manager
 */
export class SAF {
	public static from(base: string, handle: string): SAF;
	public static from(handle: string): SAF;
	public static from(a: string, b?: string): SAF {
		const dir = b === undefined ? undefined : a;
		let handle = b === undefined ? a : b;
		if (handle.startsWith('~')) {
			handle = resolveTilde(handle);
		}

		if (handle.includes('..')) {
			handle = path.resolve(handle);
		}


		if (dir) {
			return new SAF(path.resolve(dir, handle));
		}

		return new SAF(handle);
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
		this.#handle = handle;
	}

	get base(): string | undefined {
		return path.basename(this.#handle, this.extension);
	}

	set base(value: string) {
		this.#dirty = path.join(this.directory, value + this.extension);
	}

	get name(): string | undefined {
		return this.file.name;
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


	public async json<T>(data?: T): Promise<T> {
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

		return this.file.exists();
	}

	public async write(input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile) {
		return Bun.write(this.file, input);
	}


	public async bytes(): Promise<Uint8Array> {
		return new Uint8Array(await this.file.arrayBuffer());
	}

	public async delete() {
		if (await this.file.exists()) {
			fs.unlinkSync(this.#handle);
		}

		this.#handle = '';
		return this;
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
		fs.mkdir(this.directory, { recursive: true }, error => {
			if (error) {
				console.error(error);
				throw new Error(`Couldn't create directory: ${this.directory}`);
			}
		});
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