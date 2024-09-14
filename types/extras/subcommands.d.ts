type Subcommand<Arguments extends unknown[] = unknown[], ReturnValue = void> = (...parameters: Arguments) => Promise<ReturnValue>;
declare class Subcommands<Callback, Config extends Record<string, Callback>, Name extends keyof Config = keyof Config> {
    private readonly _commands;
    constructor(commands: Config);
    get<N extends Name>(commandName?: N): Config[N];
    get<F extends Name>(commandName: string | undefined, fallback: F): Config[F];
    get commands(): Name[];
    maybeHelp(): this;
}
/**
 * TypeScript doesn't support partial type inference,
 * So we need to use a factory function to create the subcommands.
 */
export declare function subcommandFactory<Arguments extends unknown[] = unknown[], ReturnValue = void>(): <Name extends string, Config extends Record<Name, Subcommand<Arguments, ReturnValue>>>(commands: Config) => Subcommands<unknown, Config, keyof Config>;
export declare const subcommands: <Name extends string, Config extends Record<Name, Subcommand<unknown[], void>>>(commands: Config) => Subcommands<unknown, Config, keyof Config>;
export {};
