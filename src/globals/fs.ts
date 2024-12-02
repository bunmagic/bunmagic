import type { GlobScanOptions } from 'bun';
import { SAF } from '../extras/saf';

export async function isDirectory(path: string) {
	const saf = await SAF.prepare(path);
	return saf.isDirectory();
}

export async function ensureDirectory(path: string) {
	const saf = await SAF.prepare(path);
	await saf.ensureDirectory();
	return true;
}

export function cd(path: string | SAF) {
	if (typeof path === 'string') {
		$.cwd(resolveTilde(path));
	} else {
		$.cwd(path.path);
	}
}

export async function cwd() {
	// eslint-disable-next-line unicorn/no-await-expression-member
	return (await $`pwd`.text()).trim();
}


export function resolveTilde(input: string) {
	if (input.startsWith('~')) {
		return `${$HOME}${input.slice(1)}`;
	}

	return input;
}

export async function glob(pattern = '*', options: GlobScanOptions = {}) {
	const defaultGlobOptions: GlobScanOptions = {
		onlyFiles: true,
		absolute: true,
	};

	if (!options.cwd) {
		defaultGlobOptions.cwd = await cwd();
	}


	const glob = new Bun.Glob(pattern);
	const files: string[] = [];
	for await (const file of glob.scan({ ...defaultGlobOptions, ...options })) {
		files.push(file);
	}

	return files;
}
