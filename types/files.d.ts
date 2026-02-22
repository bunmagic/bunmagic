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
/**
 * @deprecated `files.resolve()` is deprecated and will be removed in v2.0.0. Use `path.resolve(...)`.
 */
export declare function resolve(input: PathLike, ...rest: PathLike[]): string;
/**
 * @deprecated `files.stem()` is deprecated and will be removed in v2.0.0. Use `path.parse(...).name`.
 */
export declare function stem(input: PathLike): string;
/**
 * @deprecated `files.pathExists()` is deprecated and will be removed in v2.0.0. Use `await Bun.file(path).exists()` or `access/stat`.
 */
export declare function pathExists(target: PathLike): Promise<boolean>;
/**
 * @deprecated `files.isFile()` is deprecated and will be removed in v2.0.0. Use `stat(...).isFile()`.
 */
export declare function isFile(target: PathLike): Promise<boolean>;
/**
 * @deprecated `files.isDir()` is deprecated and will be removed in v2.0.0. Use `stat(...).isDirectory()`.
 */
export declare function isDir(target: PathLike): Promise<boolean>;
/**
 * @deprecated `files.ensureDir()` is deprecated and will be removed in v2.0.0. Use `mkdir(..., { recursive: true })`.
 */
export declare function ensureDir(target: PathLike): Promise<string>;
/**
 * @deprecated `files.ensureFile()` is deprecated and will be removed in v2.0.0. Use `mkdir(...)` + `open(..., 'a')`.
 */
export declare function ensureFile(target: PathLike): Promise<string>;
/**
 * @deprecated `files.emptyDir()` is deprecated and will be removed in v2.0.0. Use `readdir` + `rm`.
 */
export declare function emptyDir(target: PathLike): Promise<string>;
/**
 * @deprecated `files.readFile()` is deprecated and will be removed in v2.0.0. Use `await Bun.file(path).text()`.
 */
export declare function readFile(target: PathLike): Promise<string>;
/**
 * @deprecated `files.readBytes()` is deprecated and will be removed in v2.0.0. Use `await Bun.file(path).arrayBuffer()`.
 */
export declare function readBytes(target: PathLike): Promise<Uint8Array<ArrayBuffer>>;
/**
 * @deprecated `files.writeFile()` is deprecated and will be removed in v2.0.0. Use `Bun.write(...)` or `open(..., 'wx')`.
 */
export declare function writeFile(target: PathLike, input: BlobInput, options?: WriteTextOptions): Promise<number>;
/**
 * @deprecated `files.outputFile()` is deprecated and will be removed in v2.0.0. Use `mkdir(...)` + `Bun.write(...)`.
 */
export declare function outputFile(target: PathLike, input: BlobInput, options?: WriteTextOptions): Promise<number>;
/**
 * @deprecated `files.editFile()` is deprecated and will be removed in v2.0.0. Use explicit read/update/write flow.
 */
export declare function editFile(target: PathLike, updater: (content: string) => string | Promise<string>, options?: WriteTextOptions): Promise<string>;
/**
 * @deprecated `files.copy()` is deprecated and will be removed in v2.0.0. Use `cp(...)`.
 */
export declare function copy(source: PathLike, destination: PathLike, options?: MoveCopyOptions): Promise<string>;
/**
 * @deprecated `files.move()` is deprecated and will be removed in v2.0.0. Use `rename(...)` with `EXDEV` fallback.
 */
export declare function move(source: PathLike, destination: PathLike, options?: MoveCopyOptions): Promise<string>;
/**
 * @deprecated `files.remove()` is deprecated and will be removed in v2.0.0. Use `rm(..., { recursive: true, force: true })`.
 */
export declare function remove(target: PathLike): Promise<string>;
export declare function glob(pattern?: string, options?: GlobScanOptions): Promise<string[]>;
/**
 * @deprecated `files.ensureUniquePath()` is deprecated and will be removed in v2.0.0. Use explicit suffixing logic.
 */
export declare function ensureUniquePath(target: PathLike, options?: SuffixOptions): Promise<string>;
/**
 * @deprecated `files.writeFileSafe()` is deprecated and will be removed in v2.0.0. Use explicit unique-path + write flow.
 */
export declare function writeFileSafe(target: PathLike, input: BlobInput, options?: WriteTextOptions & {
    suffix?: SuffixOptions;
}): Promise<string>;
/**
 * @deprecated `files.copySafe()` is deprecated and will be removed in v2.0.0. Use explicit unique-path + copy flow.
 */
export declare function copySafe(source: PathLike, destination: PathLike, options?: MoveCopyOptions & {
    suffix?: SuffixOptions;
}): Promise<string>;
/**
 * @deprecated `files.moveSafe()` is deprecated and will be removed in v2.0.0. Use explicit unique-path + move flow.
 */
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
