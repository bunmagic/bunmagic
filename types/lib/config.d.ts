export declare const PATHS: {
    readonly bunmagic: string;
    readonly bins: string;
    readonly config: string;
};
export declare const SUPPORTED_FILES: string[];
export type SupportedFiles = (typeof SUPPORTED_FILES)[number];
export type SourcePaths = {
    namespace?: string;
    dir: string;
};
export type Config = {
    extension: string;
    sources?: SourcePaths[];
};
export type ConfigKey = keyof Config;
export declare function get<K extends ConfigKey>(key: K): Promise<Config[K]>;
export declare function update<K extends keyof Config>(key: K, value: Config[K]): Promise<number>;
export declare function set(config: Config): Promise<number>;
