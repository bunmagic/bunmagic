/* eslint-disable unicorn/prefer-export-from */
// Importing each module
import os from 'node:os';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './not-minimist';

export { $spinner } from './spinner';
export { default as path } from 'node:path';
export { notMinimist };

export * from './utils';
export { select } from './selection';
export * from './fs';


export const argv = notMinimist(Bun.argv.slice(2) || []);
export const args = argv._; // eslint-disable-line unicorn/prevent-abbreviations
export const flags = { ...argv, _: undefined };
export const $HOME = os.homedir();
export {
	ansis, ansis as chalk, os, $,
};
