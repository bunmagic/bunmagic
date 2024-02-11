/* eslint-disable unicorn/prefer-export-from */
// Importing each module
import os from 'node:os';
import {$} from 'bun';
import ansis from 'ansis';
import {notMinimist} from './not-minimist';

export {default as path} from 'node:path';
export {notMinimist};

export * from './utils';
export * from './fs';

export const argv = notMinimist(Bun.argv.slice(2) || []);
export const $HOME = os.homedir();
export {
	$, ansis, ansis as chalk, os,
};
