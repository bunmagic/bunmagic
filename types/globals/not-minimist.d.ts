/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type Flag = string | number | boolean | undefined;
export declare function notMinimist(arguments_: string[]): Record<string, Flag> & {
    _: string[];
};
export {};
