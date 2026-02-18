import type { BunFile, GlobScanOptions } from 'bun';
export type PathLike = string;
export type BlobInput = Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile;
export type SuffixOptions = {
    separator?: string;
    start?: number;
    maxAttempts?: number;
};
export type MoveCopyOptions = {
    overwrite?: boolean;
    errorOnExist?: boolean;
};
export type WriteTextOptions = {
    flag?: 'w' | 'wx';
    atomic?: boolean;
};
export declare function resolve(input: PathLike, ...rest: PathLike[]): string;
export declare function stem(input: PathLike): string;
export declare function pathExists(target: PathLike): Promise<boolean>;
export declare function isFile(target: PathLike): Promise<boolean>;
export declare function isDir(target: PathLike): Promise<boolean>;
export declare function ensureDir(target: PathLike): Promise<string>;
export declare function ensureFile(target: PathLike): Promise<string>;
export declare function emptyDir(target: PathLike): Promise<string>;
export declare function readFile(target: PathLike): Promise<string>;
export declare function readBytes(target: PathLike): Promise<Uint8Array<ArrayBuffer>>;
export declare function writeFile(target: PathLike, input: BlobInput, options?: WriteTextOptions): Promise<number>;
export declare function outputFile(target: PathLike, input: BlobInput, options?: WriteTextOptions): Promise<number>;
export declare function editFile(target: PathLike, updater: (content: string) => string | Promise<string>, options?: WriteTextOptions): Promise<string>;
export declare function copy(source: PathLike, destination: PathLike, options?: MoveCopyOptions): Promise<string>;
export declare function move(source: PathLike, destination: PathLike, options?: MoveCopyOptions): Promise<string>;
export declare function remove(target: PathLike): Promise<string>;
export declare function glob(pattern?: string, options?: GlobScanOptions): Promise<string[]>;
export declare function ensureUniquePath(target: PathLike, options?: SuffixOptions): Promise<string>;
export declare function writeFileSafe(target: PathLike, input: BlobInput, options?: WriteTextOptions & {
    suffix?: SuffixOptions;
}): Promise<string>;
export declare function copySafe(source: PathLike, destination: PathLike, options?: MoveCopyOptions & {
    suffix?: SuffixOptions;
}): Promise<string>;
export declare function moveSafe(source: PathLike, destination: PathLike, options?: MoveCopyOptions & {
    suffix?: SuffixOptions;
}): Promise<string>;
export declare const files: {
    readonly resolve: typeof resolve;
    readonly stem: typeof stem;
    readonly pathExists: typeof pathExists;
    readonly isFile: typeof isFile;
    readonly isDir: typeof isDir;
    readonly ensureDir: typeof ensureDir;
    readonly ensureFile: typeof ensureFile;
    readonly emptyDir: typeof emptyDir;
    readonly readFile: typeof readFile;
    readonly readBytes: typeof readBytes;
    readonly writeFile: typeof writeFile;
    readonly outputFile: typeof outputFile;
    readonly editFile: typeof editFile;
    readonly copy: typeof copy;
    readonly move: typeof move;
    readonly remove: typeof remove;
    readonly glob: typeof glob;
    readonly ensureUniquePath: typeof ensureUniquePath;
    readonly writeFileSafe: typeof writeFileSafe;
    readonly copySafe: typeof copySafe;
    readonly moveSafe: typeof moveSafe;
};
