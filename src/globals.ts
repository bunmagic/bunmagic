// Importing each module
import { $ } from "bun";
export { default as chalk } from 'chalk';
export { default as fs } from 'fs-extra';
export { globby } from 'globby';
export { default as os } from 'node:os';
export { default as path } from 'path';
import minimist from 'minimist';

export * from './globals/utils';

export const argv = minimist(process.argv.slice(2) || [])
export { minimist, $ };