export const PATHS: {
	bunmagic: string;
	bins: string;
	config: string;
} = {
	bunmagic: `${$HOME}/.bunmagic`,
	bins: `${$HOME}/.bunmagic/bin`,
	config: `${$HOME}/.bunmagic/config.json`,
};

export const SUPPORTED_FILES = ['ts', 'mjs', 'js'] as const;
export type SupportedFiles = typeof SUPPORTED_FILES[number];

export type Collection<NS = unknown> = {
	namespace: NS extends unknown
		? string | undefined
		: NS extends string
			? NS
			: undefined;
	dir: string;
};

export type Config = {
	extension: string & typeof SUPPORTED_FILES[number];
	sources?: Collection[];
};

export type ConfigKey = keyof Config;

async function config(): Promise<Config> {
	try {
		return await Bun.file(PATHS.config).json<Config>();
	} catch {
		return {
			extension: 'ts',
		};
	}
}

export async function get<K extends ConfigKey>(key: K): Promise<Config[K]> {
	const data = await config();
	return data[key];
}

export async function update<K extends keyof Config>(key: K, value: Config[K]) {
	const json = await config();
	json[key] = value;
	return set(json);
}

export async function set(config: Config) {
	return Bun.write(PATHS.config, JSON.stringify(config, null, 4));
}
