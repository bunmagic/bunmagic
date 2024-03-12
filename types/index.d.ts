/// <reference types="node" />
/// <reference types="node" />
/// <reference types="bun-types" />
import * as os from 'node:os';
import * as path from 'node:path';
import ansis from 'ansis';
import { $ } from 'bun';
import { notMinimist } from './globals/not-minimist';
export { $spinner } from './globals/spinner';
export { notMinimist };
export * from './globals/utils';
export { select } from './globals/selection';
export * from './globals/fs';
export declare const argv: Record<string, string | number | boolean> & {
    _: string[];
};
export declare const args: string[];
export declare const flags: Record<string, string | boolean | undefined>;
export declare const $HOME: string;
export { ansis, ansis as chalk, os, $, path, };
