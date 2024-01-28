export const PATHS: {
	bunshell: string;
	bins: string;
	config: string;
} = {
	bunshell: `${os.homedir()}/.bunshell`,
	bins: `${os.homedir()}/.bunshell/bin`,
	config: `${os.homedir()}/.bunshell/config.json`,
}

export const SUPPORTED_FILES = ["mjs", "js", "ts"] as const;

export type Config = {
	extension: string & typeof SUPPORTED_FILES[number];
	sources?: {
		path: string;
		bin?: string;
	}[]
}

async function config(): Promise<Config> {
	try {
		return await Bun.file(PATHS.config).json<Config>();
	} catch (error) {
		return {} as Config;
	}
}

export async function get<K extends keyof Config>(key: K, fallback?: Config[K] | undefined): Promise<Config[K]> {
	return (await config())[key];
}

export async function update<K extends keyof Config>(key: K, value: Config[K]) {
	const json = await config();
	json[key] = value;
	return await Bun.write(PATHS.config, JSON.stringify(json, null, 4));
}