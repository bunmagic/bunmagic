export const PATHS: {
	bunism: string;
	bins: string;
	config: string;
	source: string;
} = {
	bunism: `${$HOME}/.bunism`,
	bins: `${$HOME}/.bunism/bin`,
	config: `${$HOME}/.bunism/config.json`,
	source: Bun.env.BUNS_PATH ?? `${os.homedir()}/.buns`
}

export const SUPPORTED_FILES = ["ts", "mjs", "js"] as const;
export type SupportedFiles = typeof SUPPORTED_FILES[number];
export type Script = {
	slug: string;
	bin: string;
	file: string;
	filename: string;
	command: string;
	path: string;
}

export type Namespace = {
	namespace: string;
	path: string;
	scripts: Script[];
}

export type Scripts = {
	namespace: undefined;
	path: string;
	scripts: Script[];
}
export type Config = {
	extension: string & typeof SUPPORTED_FILES[number];
	sources?: Scripts[] | Namespace[];
}

async function config(): Promise<Config> {
	try {
		return await Bun.file(PATHS.config).json<Config>();
	} catch (error) {
		return {} as Config;
	}
}

export async function get<K extends keyof Config>(key: K, fallback?: Config[K] | undefined): Promise<Config[K] | undefined> {
	return (await config())[key] ?? fallback;
}

export async function update<K extends keyof Config>(key: K, value: Config[K]) {
	const json = await config();
	json[key] = value;
	return set(json);
}

export function set(config: Config) {
	return Bun.write(PATHS.config, JSON.stringify(config, null, 4));
}