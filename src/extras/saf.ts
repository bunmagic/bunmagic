import type { BunFile } from 'bun';
import fs from 'fs-extra';

/**
 * Swiss Army File manager
 */
export class SAF {
	public safeMode = true;
	public separator = '_';
	#handle: string;

	constructor (handle: string) {
		this.#handle = handle;
		if (this.#handle.startsWith('~')) {
			this.#handle = resolveTilde(this.#handle);
		}
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

	public async move(to: string) {
		await fs.move(this.path, to);
		this.#handle = to;
	}

	public async delete() {
		await fs.unlink(this.path);
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

	/**
	 * Safely renames a file, adding a number suffix if the target already exists
	 * @param name The desired new name
	 * @returns The actual new path used
	 */
	private async safeRename(name: string): Promise<string> {
		const targetPath = this.safeMode ? this.relative(name) : await this.getSafePath(name);
		await this.move(targetPath);
		return targetPath;
	}
}
