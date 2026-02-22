import * as os from 'node:os';
import * as path from 'node:path';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './globals/not-minimist';
import { getRuntimeArgs } from './lib/runtime-args';

export { $spinner } from './globals/spinner';
export { openEditor, slugify } from './lib/utils';
export { notMinimist };
export { CLI } from './extras/cli';
export * from './extras/mac';
export { SAF } from './extras/saf';
export type {
	BlobInput,
	MoveCopyOptions,
	PathLike,
	SuffixOptions,
	WriteTextOptions,
} from './files';
export {
	copy,
	copySafe,
	editFile,
	emptyDir,
	ensureDir,
	ensureFile,
	ensureUniquePath,
	files,
	isDir,
	isFile,
	move,
	moveSafe,
	outputFile,
	pathExists,
	readBytes,
	readFile,
	remove,
	resolve,
	stem,
	writeFile,
	writeFileSafe,
} from './files';
export { cd, cwd, ensureDirectory, glob, isDirectory, resolveTilde } from './globals/fs';
export { showHelp } from './globals/help';
export * from './globals/selection';
export { $stdin } from './globals/stdin';
export * from './globals/utils';

const { args, passthroughArgs, flags, argv, arg, flag } = getRuntimeArgs();
export const $HOME = os.homedir();
export { $, path, ansis, ansis as chalk, os, args, passthroughArgs, argv, flags, arg, flag };
