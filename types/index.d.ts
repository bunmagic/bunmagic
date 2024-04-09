/// <reference types="node" />
/// <reference types="node" />
/// <reference types="bun-types" />
import * as os from 'node:os';
import * as path from 'node:path';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './globals/not-minimist';
export { $spinner } from './globals/spinner';
export { openEditor, slugify } from './lib/utils';
export { notMinimist };
export * from './globals/utils';
export { select, autoselect, getPassword } from './globals/selection';
export * from './globals/fs';
declare const args: string[], flags: Record<string, string | number | boolean>;
declare const argv: {
    _: string[];
};
export declare const $HOME: string;
export { $, path, ansis, ansis as chalk, os, args, argv, flags, };
