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

	public static async create(target: string) {
		const destination = SAF.from(target);
		if (await destination.file.exists()) {
			const safeTarget = await destination.getSafePath(target);
			destination.#handle = safeTarget;
		}

		return destination;
	}


	public safeMode = true;
	public separator = '_';
	#handle: string;

	constructor(handle: string) {
		this.#handle = handle;
	}

	public async json<T>(data?: T): Promise<T> {
		if (data === undefined) {
			return this.file.json() as Promise<T>;
		}

		await Bun.write(this.file, JSON.stringify(data, null, 2));
		return data;
	}

	public unsafe(value: boolean) {
		this.safeMode = !value;
	}

	get name(): string | undefined {
		return this.file.name;
	}

	get extension(): string {
		return path.extname(this.#handle);
	}

	get path(): string {
		return this.#handle;
	}

	get file(): BunFile {
		return Bun.file(this.#handle);
	}

	get directory(): string {
		return path.dirname(this.#handle);
	}

	public relative(name: string): string {
		return path.relative(this.directory, name);
	}

	public async bytes(): Promise<Uint8Array> {
		return new Uint8Array(await this.file.arrayBuffer());
	}

	public async move(to: string) {
		const destination = await SAF.create(to);
		await Bun.write(destination.file, this.file);
		this.#handle = destination.path;
	}

	public async delete() {
		const file = Bun.file(this.path);
		await file.writer().end();
		this.#handle = '';
	}


	/**
	 * Generates a safe filename by appending a number if the file already exists
	 * @param newPath The desired new path
	 * @returns A safe path that doesn't exist
	 */
	private async getSafePath(newPath: string): Promise<string> {
		const directory = path.dirname(newPath);
		const extension = path.extname(newPath);
		const base = path.basename(newPath, extension);

		let fullPath = newPath;
		let iteration = 0;

		while (await Bun.file(fullPath).exists()) {
			iteration++;
			if (iteration > 10) {
				throw new Error(`Failed to find a safe path for ${newPath}`);
			}

			fullPath = path.join(directory, `${base}${this.separator}${iteration}${extension}`);
		}

		return fullPath;
	}
}
