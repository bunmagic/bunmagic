import { access, open, rename, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { BunFile } from 'bun';

export type PathLike = string;
export type BlobInput =
	| Blob
	| NodeJS.TypedArray
	| ArrayBufferLike
	| string
	| Bun.BlobPart[]
	| BunFile;

export type WriteTextOptions = {
	flag?: 'w' | 'wx';
	atomic?: boolean;
};

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

function withWriteDefaults(options?: WriteTextOptions): Required<WriteTextOptions> {
	return {
		flag: options?.flag ?? 'w',
		atomic: options?.atomic ?? false,
	};
}

function createExistsError(target: string) {
	const error = new Error(`Path already exists: ${target}`) as Error & { code?: string };
	error.code = 'EEXIST';
	return error;
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

async function assertMissingWhenExclusive(target: string, flag: WriteTextOptions['flag']) {
	if (flag === 'wx' && (await pathExists(target))) {
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

export function resolve(input: PathLike, ...rest: PathLike[]) {
	const parts = parseResolveInputs(input, rest);
	return path.resolve(...parts);
}

export async function pathExists(target: PathLike) {
	const resolved = resolvePathLike(target);
	try {
		await access(resolved);
		return true;
	} catch {
		return false;
	}
}

export async function writeFile(target: PathLike, input: BlobInput, options?: WriteTextOptions) {
	const resolved = resolvePathLike(target);
	const writeOptions = withWriteDefaults(options);
	if (writeOptions.atomic) {
		return writeFileAtomic(resolved, input, writeOptions);
	}

	if (writeOptions.flag === 'wx') {
		const handle = await open(resolved, 'wx');
		try {
			const data = await toWriteData(input);
			await handle.writeFile(data);
		} finally {
			await handle.close();
		}
		return Bun.file(resolved).size;
	}

	return Bun.write(resolved, input);
}
