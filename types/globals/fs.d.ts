/// <reference types="bun-types" />
/// <reference types="bun-types" />
import type { GlobScanOptions } from 'bun';
import type { SAF as SAFType } from '../extras/saf';
export declare function isDirectory(path: string): Promise<boolean>;
export declare function ensureDirectory(path: string): Promise<boolean>;
export declare function cd(path: string | SAFType): void;
export declare function cwd(): Promise<string>;
export declare function resolveTilde(input: string): string;
export declare function glob(pattern?: string, options?: GlobScanOptions): Promise<string[]>;
