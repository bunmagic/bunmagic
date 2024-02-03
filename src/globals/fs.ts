import fs from "node:fs";

export async function isDir(path: string) {
	const file = Bun.file(path);
	return file.size !== 0 && file.type === "dir";
}

export async function ensureDir(path: string) {
	if (!await isDir(path)) {
		fs.mkdir(path, { recursive: true }, (err) => {
			if (err) {
				console.error(err);
				throw new Error(`Couldn't create directory: ${path}`);
			}
		});
	}
	return true;
}