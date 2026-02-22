/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type StructuredArguments = {
    flags: Record<string, string | number | boolean | undefined>;
    args: string[];
    passthroughArgs: string[];
};
export declare function notMinimist(input: string[]): StructuredArguments;
export {};
