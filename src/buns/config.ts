export const PATHS: {
	bunshell: string;
	bins: string;
	config: string;
} = {
	bunshell: `${os.homedir()}/.bunshell`,
	bins: `${os.homedir()}/.bunshell/bin`,
	config: `${os.homedir()}/.bunshell/config.json`,
}

export function get(key: string | boolean = false): any | boolean {
	if (!fs.pathExistsSync(PATHS.config)) {
		return false;
	}
	const json = JSON.parse(fs.readFileSync(PATHS.config, "utf-8"));
	if (key === false) {
		return json;
	}

	if (typeof key === "string" && key in json) {
		return json[key];
	}

	return false;
}

export function update(key: string, value: any): void {
	const json = fs.pathExistsSync(PATHS.config) ? get() : {};
	json[key] = value;
	fs.writeFileSync(PATHS.config, JSON.stringify(json, null, 4), {
		encoding: "utf8",
	});
}