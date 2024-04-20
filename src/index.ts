/* eslint-disable unicorn/prefer-export-from */
// Importing each module
import * as os from 'node:os';
import * as path from 'node:path';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './globals/not-minimist';

export { $spinner } from './globals/spinner';
export { openEditor, slugify } from './lib/utils';
export { notMinimist };

export * from './globals/utils';
export { select, autoselect, getPassword, ask } from './globals/selection';
export * from './globals/fs';


const { args, flags } = notMinimist(Bun.argv.slice(2) || []);
const argv = { _: args, ...flags };
export const $HOME = os.homedir();
export {
	$,
	path,
	ansis,
	ansis as chalk,
	os,
	args,
	argv,
	flags,
};
