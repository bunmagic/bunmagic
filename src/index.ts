import * as os from 'node:os';
import * as path from 'node:path';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './globals/not-minimist';

export { $spinner } from './globals/spinner';
export { openEditor, slugify } from './lib/utils';
export { notMinimist };
export { CLI } from './extras/cli';
export * from './extras/mac';
export { SAF } from './extras/saf';
export * from './globals/fs';
export { showHelp } from './globals/help';
export * from './globals/selection';
export { $stdin } from './globals/stdin';
export * from './globals/utils';

const { args, flags } = notMinimist(Bun.argv.slice(2) || []);
const argv = { _: args, ...flags };
export const $HOME = os.homedir();
export { $, path, ansis, ansis as chalk, os, args, argv, flags };
