/// <reference types="bun-types" />
/// <reference types="bun-types" />
import type { GlobScanOptions } from 'bun';
export declare function isDirectory(path: string): Promise<unknown>;
export declare function ensureDirectory(path: string): Promise<boolean>;
export declare function cd(path: string): void;
export declare function cwd(): Promise<string>;
export declare function resolveTilde(input: string): string;
export declare function glob(pattern?: string, options?: GlobScanOptions): Promise<string[]>;
