/**
 * Run a shell command and return the result as text,
 * even if it's an error.
 */
export declare function $get(...properties: Parameters<typeof $>): Promise<string>;
export declare function ack(q: string, defaultAnswer?: 'y' | 'n'): boolean;
export declare class Exit extends Error {
    constructor(error?: unknown);
    private indent;
    private exit;
}
export declare function die(output: unknown): void;
export declare const sleep: (ms: number) => Promise<void>;
