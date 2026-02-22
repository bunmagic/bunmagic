import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import type { GlobScanOptions } from 'bun';
import type { SAF as SAFType } from '../extras/saf';

export async function isDirectory(target: string) {
	try {
		return (await stat(path.resolve(resolveTilde(target)))).isDirectory();
	} catch {
		return false;
	}
}

export async function ensureDirectory(target: string) {
	await mkdir(path.resolve(resolveTilde(target)), { recursive: true });
	return true;
}

export function cd(target: string | SAFType) {
	if (typeof target === 'string') {
		$.cwd(resolveTilde(target));
	} else {
		$.cwd(target.path);
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
