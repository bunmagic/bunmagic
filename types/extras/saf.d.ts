import type { BunFile } from 'bun';
/**
 * Swiss Army File manager
 * @deprecated SAF is deprecated and will be removed in v2.0.0. Use `files.*` helpers.
 */
export declare class SAF {
    #private;
    /**
     * Safe mode ensures that when the file is moved or renamed,
     * it will not overwrite an existing file at the destination.
     */
    safeMode: boolean;
    /**
     * How to separate the base name from the iteration number
     */
    safeSeparator: string;
    constructor(handle: string);
    /**
     * Get a SAF instance from a target path
     * @deprecated SAF is deprecated and will be removed in v2.0.0. Use `files.*` helpers.
     */
    static from(dir: string, target: string): SAF;
    static from(target: string): SAF;
    /**
     * Prepare a target path for writing
     * @deprecated SAF is deprecated and will be removed in v2.0.0. Use `files.*` helpers.
     */
    static prepare(target: string): Promise<SAF>;
    /**
     *
     * - Utilities
     *
     */
    /**
     * `/path/to/file.txt` -> `file`
     */
    get base(): string | undefined;
    set base(value: string);
    /**
     * `/path/to/file.txt` -> `file.txt`
     */
    get name(): string | undefined;
    set name(value: string);
    /**
     * `/path/to/file.txt` -> `/path/to`
     */
    get directory(): string;
    set directory(value: string);
    /**
     * `/path/to/file.txt` -> `.txt`
     */
    get extension(): string;
    set extension(value: string);
    /**
     * `/path/to/file.txt`
     */
    get path(): string;
    set path(value: string);
    /**
     * Get the Bun file instance
     */
    get file(): BunFile;
    unsafe(): this;
    safe(): this;
    /**
     * Quickly read/write JSON
     */
    json<T = unknown>(data?: T): Promise<T>;
    update(): Promise<this>;
    exists(): Promise<boolean>;
    isFile(): Promise<boolean>;
    isDirectory(): Promise<boolean>;
    write(input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile): Promise<number>;
    bytes(): Promise<Uint8Array>;
    delete(postDelete?: 'clear_handle' | 'keep_handle'): Promise<this>;
    ensureDirectory(): Promise<void>;
    edit(callback: (content: string) => string | Promise<string>): Promise<this>;
    /**
     *
     * - Serialization
     *
     */
    toString(): string;
    valueOf(): string;
    /**
     * Generates a safe filename by appending a number if the file already exists
     * @param newPath The desired new path
     * @returns A safe path that doesn't exist
     */
    private getSafePath;
}
