/* eslint-disable unicorn/prefer-export-from */
// Importing each module
import os from 'node:os';
import ansis from 'ansis';
import {$} from 'bun';
import {notMinimist} from './not-minimist';

export {$spinner} from './spinner';
export {default as path} from 'node:path';
export {notMinimist};

export const BM = {
	verbose: false,
} as const;

/**
 * Customize $ to allow enabling/disabling verbose mode globally
 */
Object.assign($, async (...properties: Parameters<typeof $>) => {
	if (BM.verbose) {
		return $(...properties);
	}

	return $(...properties).quiet();
});

export * from './utils';
export * from './fs';


export const argv = notMinimist(Bun.argv.slice(2) || []);
export const $HOME = os.homedir();
export {
	ansis, ansis as chalk, os, $,
};
