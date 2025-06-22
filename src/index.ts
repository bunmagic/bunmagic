import * as os from 'node:os';
import * as path from 'node:path';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './globals/not-minimist';

export { $spinner } from './globals/spinner';
export { openEditor, slugify } from './lib/utils';
export { notMinimist };
export { showHelp } from './globals/help';
export { $stdin } from './globals/stdin';

export * from './globals/utils';
export * from './globals/selection';
export * from './globals/fs';
export { SAF } from './extras/saf';
export { CLI } from './extras/cli';
export * from './extras/mac';

const { args, flags } = notMinimist(Bun.argv.slice(2) || []);
const argv = { _: args, ...flags };
export const $HOME = os.homedir();
export { $, path, ansis, ansis as chalk, os, args, argv, flags };
