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
export type { BlobInput, MoveCopyOptions, PathLike, SuffixOptions, WriteTextOptions, } from './files';
export { copy, copySafe, editFile, emptyDir, ensureDir, ensureFile, ensureUniquePath, files, isDir, isFile, move, moveSafe, outputFile, pathExists, readBytes, readFile, remove, resolve, stem, writeFile, writeFileSafe, } from './files';
export { cd, cwd, ensureDirectory, glob, isDirectory, resolveTilde } from './globals/fs';
export { showHelp } from './globals/help';
export * from './globals/selection';
export { $stdin } from './globals/stdin';
export * from './globals/utils';
declare const args: string[], flags: Record<string, string | number | boolean | undefined>, argv: Record<string, string | number | boolean | string[] | undefined>, arg: (index: number) => {
    string(): {
        default(defaultValue: string): string;
        required(message?: string): string;
        optional(): string | undefined;
    };
    int(): {
        default(defaultValue: number): number;
        required(message?: string): number;
        optional(): number | undefined;
    };
    number(): {
        default(defaultValue: number): number;
        required(message?: string): number;
        optional(): number | undefined;
    };
    boolean(): {
        default(defaultValue: boolean): boolean;
        required(message?: string): boolean;
        optional(): boolean | undefined;
    };
    enum<const T extends readonly [string, ...string[]]>(...values: T): {
        default(defaultValue: T[number]): T[number];
        required(message?: string): T[number];
        optional(): T[number] | undefined;
    };
}, flag: (name: string) => {
    string(): {
        default(defaultValue: string): string;
        required(message?: string): string;
        optional(): string | undefined;
    };
    int(): {
        default(defaultValue: number): number;
        required(message?: string): number;
        optional(): number | undefined;
    };
    number(): {
        default(defaultValue: number): number;
        required(message?: string): number;
        optional(): number | undefined;
    };
    boolean(): {
        default(defaultValue: boolean): boolean;
        required(message?: string): boolean;
        optional(): boolean | undefined;
    };
    enum<const T extends readonly [string, ...string[]]>(...values: T): {
        default(defaultValue: T[number]): T[number];
        required(message?: string): T[number];
        optional(): T[number] | undefined;
    };
};
export declare const $HOME: string;
export { $, path, ansis, ansis as chalk, os, args, argv, flags, arg, flag };
