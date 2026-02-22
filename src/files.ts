import { access, cp, mkdir, open, readdir, rename, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { BunFile, GlobScanOptions } from 'bun';
import { $ } from 'bun';
import { warnDeprecationOnce } from './lib/deprecations';

export type PathLike = string;
export type BlobInput =
	| Blob
	| NodeJS.TypedArray
	| ArrayBufferLike
	| string
	| Bun.BlobPart[]
	| BunFile;

export type SuffixOptions = {
	separator?: string;
	start?: number;
	maxAttempts?: number;
};

export type MoveCopyOptions = {
	overwrite?: boolean;
	errorOnExist?: boolean;
};

export type WriteTextOptions = {
	flag?: 'w' | 'wx';
	atomic?: boolean;
};

const FILES_DEPRECATION_TARGET = 'v2.0.0';
const FILES_DEPRECATION_MESSAGE_TAIL =
	'Use Bun.file(), Bun.write(), or node:fs/promises APIs. `glob()` remains supported.';

function warnFilesDeprecation(name: string) {
	warnDeprecationOnce(
		`files:${name}`,
		`[bunmagic] files.${name}() is deprecated and will be removed in ${FILES_DEPRECATION_TARGET}. ${FILES_DEPRECATION_MESSAGE_TAIL}`,
	);
}

function expandTilde(input: string) {
	if (input === '~') {
		return os.homedir();
	}

	if (input.startsWith('~/')) {
		return path.join(os.homedir(), input.slice(2));
	}

	return input;
}

function toPathString(input: PathLike) {
	if (input.trim().length === 0) {
		throw new TypeError('Path must be a non-empty string');
	}

	return input;
}

function resolvePathLike(input: PathLike) {
	return path.resolve(expandTilde(toPathString(input)));
}

function parseResolveInputs(input: PathLike, rest: PathLike[]) {
	return [input, ...rest].map(part => expandTilde(toPathString(part)));
}

function createExistsError(target: string) {
	const error = new Error(`Path already exists: ${target}`) as Error & { code?: string };
	error.code = 'EEXIST';
	return error;
}

function createOverlapMoveError(source: string, destination: string) {
	const error = new Error(
		`Cannot move overlapping paths with overwrite enabled: ${source} -> ${destination}`,
	) as Error & { code?: string };
	error.code = 'EINVAL';
	return error;
}

function isNestedPath(parent: string, candidate: string) {
	const relative = path.relative(parent, candidate);
	return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function hasPathOverlap(source: string, destination: string) {
	return isNestedPath(source, destination) || isNestedPath(destination, source);
}

async function blobPartToBytes(part: Bun.BlobPart): Promise<Uint8Array> {
	if (typeof part === 'string') {
		return new TextEncoder().encode(part);
	}

	if (part instanceof Blob) {
		return new Uint8Array(await part.arrayBuffer());
	}

	if (ArrayBuffer.isView(part)) {
		return new Uint8Array(part.buffer, part.byteOffset, part.byteLength);
	}

	if (part instanceof ArrayBuffer || part instanceof SharedArrayBuffer) {
		return new Uint8Array(part);
	}

	return new TextEncoder().encode(`${part}`);
}

async function blobPartsToBytes(parts: Bun.BlobPart[]): Promise<Uint8Array> {
	const chunks = await Promise.all(parts.map(part => blobPartToBytes(part)));
	const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
	const bytes = new Uint8Array(size);
	let offset = 0;

	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}

	return bytes;
}

async function toWriteData(input: BlobInput): Promise<string | Uint8Array> {
	if (typeof input === 'string') {
		return input;
	}

	if (input instanceof Blob) {
		return new Uint8Array(await input.arrayBuffer());
	}

	if (ArrayBuffer.isView(input)) {
		return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
	}

	if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer) {
		return new Uint8Array(input);
	}

	if (Array.isArray(input)) {
		return blobPartsToBytes(input);
	}

	throw new TypeError(
		'Unsupported BlobInput for exclusive file write. Use string, Blob, TypedArray, ArrayBuffer, SharedArrayBuffer, Bun.BlobPart[], or BunFile.',
	);
}

function withWriteDefaults(options?: WriteTextOptions): Required<WriteTextOptions> {
	return {
		flag: options?.flag ?? 'w',
		atomic: options?.atomic ?? false,
	};
}

function withSuffixDefaults(options?: SuffixOptions): Required<SuffixOptions> {
	return {
		separator: options?.separator ?? '_',
		start: options?.start ?? 1,
		maxAttempts: options?.maxAttempts ?? 10_000,
	};
}

async function pathExistsResolved(resolved: string) {
	try {
		await access(resolved);
		return true;
	} catch {
		return false;
	}
}

async function assertMissingWhenExclusive(target: string, flag: WriteTextOptions['flag']) {
	if (flag === 'wx' && (await pathExistsResolved(target))) {
		throw createExistsError(target);
	}
}

async function writeFileAtomic(
	target: string,
	input: BlobInput,
	options: Required<WriteTextOptions>,
) {
	await assertMissingWhenExclusive(target, options.flag);

	const tempFile = path.join(
		path.dirname(target),
		`.${path.basename(target)}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
	);

	try {
		const result = await Bun.write(tempFile, input);
		if (options.flag === 'wx') {
			await assertMissingWhenExclusive(target, options.flag);
		}
		await rename(tempFile, target);
		return result;
	} catch (error) {
		await rm(tempFile, { force: true }).catch(() => {});
		throw error;
	}
}

async function shellCwd() {
	// eslint-disable-next-line unicorn/no-await-expression-member
	return (await $`pwd`.text()).trim();
}

async function writeFileResolved(target: string, input: BlobInput, options?: WriteTextOptions) {
	const writeOptions = withWriteDefaults(options);
	if (writeOptions.atomic) {
		return writeFileAtomic(target, input, writeOptions);
	}

	if (writeOptions.flag === 'wx') {
		const handle = await open(target, 'wx');
		try {
			const data = await toWriteData(input);
			await handle.writeFile(data);
		} finally {
			await handle.close();
		}
		return Bun.file(target).size;
	}

	return Bun.write(target, input);
}

async function copyResolved(from: string, to: string, options: MoveCopyOptions = {}) {
	const overwrite = options.overwrite ?? false;
	const errorOnExist = options.errorOnExist ?? true;

	if (!overwrite && (await pathExistsResolved(to))) {
		if (errorOnExist) {
			throw createExistsError(to);
		}
		return to;
	}

	await cp(from, to, {
		recursive: true,
		force: overwrite,
		errorOnExist: !overwrite && errorOnExist,
	});
	return to;
}

async function moveResolved(from: string, to: string, options: MoveCopyOptions = {}) {
	const overwrite = options.overwrite ?? false;
	const errorOnExist = options.errorOnExist ?? true;

	if (from === to) {
		return to;
	}

	if (overwrite && hasPathOverlap(from, to)) {
		throw createOverlapMoveError(from, to);
	}

	if (!overwrite && (await pathExistsResolved(to))) {
		if (errorOnExist) {
			throw createExistsError(to);
		}
		return to;
	}

	if (overwrite && (await pathExistsResolved(to))) {
		await rm(to, { recursive: true, force: true });
	}

	try {
		await rename(from, to);
		return to;
	} catch (error) {
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			(error as { code?: string }).code === 'EXDEV'
		) {
			await cp(from, to, {
				recursive: true,
				force: overwrite,
				errorOnExist: !overwrite,
			});
			await rm(from, { recursive: true, force: true });
			return to;
		}
		throw error;
	}
}

async function ensureUniquePathResolved(target: string, options?: SuffixOptions): Promise<string> {
	const { separator, maxAttempts } = withSuffixDefaults(options);
	const start = Math.max(1, withSuffixDefaults(options).start);
	if (!(await pathExistsResolved(target))) {
		return target;
	}

	const { dir, name, ext } = path.parse(target);
	for (let index = start; index <= maxAttempts; index++) {
		const candidate = path.join(dir, `${name}${separator}${index}${ext}`);
		if (!(await pathExistsResolved(candidate))) {
			return candidate;
		}
	}

	throw new Error(`Failed to find a safe path for ${target}`);
}

/**
 * @deprecated `files.resolve()` is deprecated and will be removed in v2.0.0. Use `path.resolve(...)`.
 */
export function resolve(input: PathLike, ...rest: PathLike[]) {
	warnFilesDeprecation('resolve');
	const parts = parseResolveInputs(input, rest);
	return path.resolve(...parts);
}

/**
 * @deprecated `files.stem()` is deprecated and will be removed in v2.0.0. Use `path.parse(...).name`.
 */
export function stem(input: PathLike) {
	warnFilesDeprecation('stem');
	const parsed = path.parse(expandTilde(toPathString(input)));
	return parsed.name;
}

/**
 * @deprecated `files.pathExists()` is deprecated and will be removed in v2.0.0. Use `await Bun.file(path).exists()` or `access/stat`.
 */
export async function pathExists(target: PathLike) {
	warnFilesDeprecation('pathExists');
	return pathExistsResolved(resolvePathLike(target));
}

/**
 * @deprecated `files.isFile()` is deprecated and will be removed in v2.0.0. Use `stat(...).isFile()`.
 */
export async function isFile(target: PathLike) {
	warnFilesDeprecation('isFile');
	const resolved = resolvePathLike(target);
	try {
		return (await stat(resolved)).isFile();
	} catch {
		return false;
	}
}

/**
 * @deprecated `files.isDir()` is deprecated and will be removed in v2.0.0. Use `stat(...).isDirectory()`.
 */
export async function isDir(target: PathLike) {
	warnFilesDeprecation('isDir');
	const resolved = resolvePathLike(target);
	try {
		return (await stat(resolved)).isDirectory();
	} catch {
		return false;
	}
}

/**
 * @deprecated `files.ensureDir()` is deprecated and will be removed in v2.0.0. Use `mkdir(..., { recursive: true })`.
 */
export async function ensureDir(target: PathLike) {
	warnFilesDeprecation('ensureDir');
	const resolved = resolvePathLike(target);
	await mkdir(resolved, { recursive: true });
	return resolved;
}

/**
 * @deprecated `files.ensureFile()` is deprecated and will be removed in v2.0.0. Use `mkdir(...)` + `open(..., 'a')`.
 */
export async function ensureFile(target: PathLike) {
	warnFilesDeprecation('ensureFile');
	const resolved = resolvePathLike(target);
	await mkdir(path.dirname(resolved), { recursive: true });
	const handle = await open(resolved, 'a');
	await handle.close();
	return resolved;
}

/**
 * @deprecated `files.emptyDir()` is deprecated and will be removed in v2.0.0. Use `readdir` + `rm`.
 */
export async function emptyDir(target: PathLike) {
	warnFilesDeprecation('emptyDir');
	const resolved = resolvePathLike(target);
	await mkdir(resolved, { recursive: true });
	const entries = await readdir(resolved);
	await Promise.all(
		entries.map(entry => rm(path.join(resolved, entry), { recursive: true, force: true })),
	);
	return resolved;
}

/**
 * @deprecated `files.readFile()` is deprecated and will be removed in v2.0.0. Use `await Bun.file(path).text()`.
 */
export async function readFile(target: PathLike) {
	warnFilesDeprecation('readFile');
	const resolved = resolvePathLike(target);
	return Bun.file(resolved).text();
}

/**
 * @deprecated `files.readBytes()` is deprecated and will be removed in v2.0.0. Use `await Bun.file(path).arrayBuffer()`.
 */
export async function readBytes(target: PathLike) {
	warnFilesDeprecation('readBytes');
	const resolved = resolvePathLike(target);
	return new Uint8Array(await Bun.file(resolved).arrayBuffer());
}

/**
 * @deprecated `files.writeFile()` is deprecated and will be removed in v2.0.0. Use `Bun.write(...)` or `open(..., 'wx')`.
 */
export async function writeFile(target: PathLike, input: BlobInput, options?: WriteTextOptions) {
	warnFilesDeprecation('writeFile');
	return writeFileResolved(resolvePathLike(target), input, options);
}

/**
 * @deprecated `files.outputFile()` is deprecated and will be removed in v2.0.0. Use `mkdir(...)` + `Bun.write(...)`.
 */
export async function outputFile(target: PathLike, input: BlobInput, options?: WriteTextOptions) {
	warnFilesDeprecation('outputFile');
	const resolved = resolvePathLike(target);
	await mkdir(path.dirname(resolved), { recursive: true });
	return writeFileResolved(resolved, input, options);
}

/**
 * @deprecated `files.editFile()` is deprecated and will be removed in v2.0.0. Use explicit read/update/write flow.
 */
export async function editFile(
	target: PathLike,
	updater: (content: string) => string | Promise<string>,
	options?: WriteTextOptions,
) {
	warnFilesDeprecation('editFile');
	const resolved = resolvePathLike(target);
	const content = await Bun.file(resolved).text();
	const next = await updater(content);
	await writeFileResolved(resolved, next, options);
	return next;
}

/**
 * @deprecated `files.copy()` is deprecated and will be removed in v2.0.0. Use `cp(...)`.
 */
export async function copy(source: PathLike, destination: PathLike, options: MoveCopyOptions = {}) {
	warnFilesDeprecation('copy');
	return copyResolved(resolvePathLike(source), resolvePathLike(destination), options);
}

/**
 * @deprecated `files.move()` is deprecated and will be removed in v2.0.0. Use `rename(...)` with `EXDEV` fallback.
 */
export async function move(source: PathLike, destination: PathLike, options: MoveCopyOptions = {}) {
	warnFilesDeprecation('move');
	return moveResolved(resolvePathLike(source), resolvePathLike(destination), options);
}

/**
 * @deprecated `files.remove()` is deprecated and will be removed in v2.0.0. Use `rm(..., { recursive: true, force: true })`.
 */
export async function remove(target: PathLike) {
	warnFilesDeprecation('remove');
	const resolved = resolvePathLike(target);
	await rm(resolved, { recursive: true, force: true });
	return resolved;
}

export async function glob(pattern = '*', options: GlobScanOptions = {}) {
	const scanner = new Bun.Glob(pattern);
	const files: string[] = [];
	const defaultGlobOptions: GlobScanOptions = {
		absolute: true,
		onlyFiles: true,
	};

	if (!options.cwd) {
		defaultGlobOptions.cwd = await shellCwd();
	}

	for await (const file of scanner.scan({ ...defaultGlobOptions, ...options })) {
		files.push(file);
	}

	return files;
}

/**
 * @deprecated `files.ensureUniquePath()` is deprecated and will be removed in v2.0.0. Use explicit suffixing logic.
 */
export async function ensureUniquePath(target: PathLike, options?: SuffixOptions): Promise<string> {
	warnFilesDeprecation('ensureUniquePath');
	return ensureUniquePathResolved(resolvePathLike(target), options);
}

/**
 * @deprecated `files.writeFileSafe()` is deprecated and will be removed in v2.0.0. Use explicit unique-path + write flow.
 */
export async function writeFileSafe(
	target: PathLike,
	input: BlobInput,
	options: WriteTextOptions & { suffix?: SuffixOptions } = {},
) {
	warnFilesDeprecation('writeFileSafe');
	const unique = await ensureUniquePathResolved(resolvePathLike(target), options.suffix);
	await writeFileResolved(unique, input, { ...options, flag: 'wx' });
	return unique;
}

/**
 * @deprecated `files.copySafe()` is deprecated and will be removed in v2.0.0. Use explicit unique-path + copy flow.
 */
export async function copySafe(
	source: PathLike,
	destination: PathLike,
	options: MoveCopyOptions & { suffix?: SuffixOptions } = {},
) {
	warnFilesDeprecation('copySafe');
	const unique = await ensureUniquePathResolved(resolvePathLike(destination), options.suffix);
	await copyResolved(resolvePathLike(source), unique, { ...options, overwrite: false });
	return unique;
}

/**
 * @deprecated `files.moveSafe()` is deprecated and will be removed in v2.0.0. Use explicit unique-path + move flow.
 */
export async function moveSafe(
	source: PathLike,
	destination: PathLike,
	options: MoveCopyOptions & { suffix?: SuffixOptions } = {},
) {
	warnFilesDeprecation('moveSafe');
	const unique = await ensureUniquePathResolved(resolvePathLike(destination), options.suffix);
	await moveResolved(resolvePathLike(source), unique, { ...options, overwrite: false });
	return unique;
}

export const files = {
	resolve,
	stem,
	pathExists,
	isFile,
	isDir,
	ensureDir,
	ensureFile,
	emptyDir,
	readFile,
	readBytes,
	writeFile,
	outputFile,
	editFile,
	copy,
	move,
	remove,
	glob,
	ensureUniquePath,
	writeFileSafe,
	copySafe,
	moveSafe,
} as const;
