import fs from 'node:fs';

export async function isDirectory(path: string) {
	const file = Bun.file(path);
	return file.size > 0 && file.type === 'dir';
}

export async function ensureDirectory(path: string) {
	if (!await isDirectory(path)) {
		fs.mkdir(path, {recursive: true}, error => {
			if (error) {
				console.error(error);
				throw new Error(`Couldn't create directory: ${path}`);
			}
		});
	}

	return true;
}
