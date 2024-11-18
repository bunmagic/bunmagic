/// <reference types="bun-types" />
/// <reference types="node" />
/// <reference types="bun-types" />
/// <reference types="bun-types" />
import type { BunFile } from 'bun';
/**
 * Swiss Army File manager
 */
export declare class SAF {
    #private;
    static from(dir: string, target: string): SAF;
    static from(target: string): SAF;
    static prepare(target: string): Promise<SAF>;
    safeMode: boolean;
    separator: string;
    constructor(handle: string);
    get base(): string | undefined;
    set base(value: string);
    get name(): string | undefined;
    set name(value: string);
    get extension(): string;
    set extension(value: string);
    get path(): string;
    set path(value: string);
    get file(): BunFile;
    get directory(): string;
    set directory(value: string);
    unsafe(): this;
    safe(): this;
    json<T = unknown>(data?: T): Promise<T>;
    update(): Promise<this>;
    exists(): Promise<unknown>;
    write(input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile): Promise<number>;
    bytes(): Promise<Uint8Array>;
    delete(postDelete?: 'clear_handle' | 'keep_handle'): Promise<this>;
    toString(): string;
    isDirectory(): Promise<unknown>;
    ensureDirectory(): Promise<void>;
    edit(callback: (content: string) => string | Promise<string>): Promise<this>;
    /**
     * Generates a safe filename by appending a number if the file already exists
     * @param newPath The desired new path
     * @returns A safe path that doesn't exist
     */
    private getSafePath;
}
