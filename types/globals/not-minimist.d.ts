/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type Flag = string | number | boolean | undefined;
type NmArgv = {
    flags: Record<string, Flag>;
    args: string[];
};
export declare function notMinimist(arguments_: string[]): NmArgv;
export {};
