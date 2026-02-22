type FlagValue = string | number | boolean | undefined;
export type TypedResolver<T> = {
    default(defaultValue: T): T;
    required(message?: string): T;
    optional(): T | undefined;
    validate(check: (value: T) => boolean, message?: string): TypedResolver<T>;
};
export type TypedAccessor = {
    string(): TypedResolver<string>;
    int(): TypedResolver<number>;
    number(): TypedResolver<number>;
    boolean(): TypedResolver<boolean>;
    enum<const T extends readonly [string, ...string[]]>(...values: T): TypedResolver<T[number]>;
};
type RuntimeArgs = {
    args: string[];
    passthroughArgs: string[];
    flags: Record<string, FlagValue>;
    argv: Record<string, string | number | boolean | string[] | undefined>;
    arg: (index: number) => TypedAccessor;
    flag: (name: string) => TypedAccessor;
};
export declare function setRuntimeArgv(input: string[]): RuntimeArgs;
export declare function getRuntimeArgs(): RuntimeArgs;
export {};
