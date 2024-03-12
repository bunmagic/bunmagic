/**
 * Run a shell command and return the result as text,
 * even if it's an error.
 */
export declare function $get(...properties: Parameters<typeof $>): Promise<string>;
export declare function ack(q: string, defaultAnswer?: 'y' | 'n'): boolean;
export declare class Exit extends Error {
    constructor(error?: unknown);
    private exit;
}
export declare const sleep: (ms: number) => Promise<unknown>;
