export const PATHS = {
	bunshell: `${os.homedir()}/.bunshell`,
	bins: `${os.homedir()}/.bunshell/bin`,
	config: `${os.homedir()}/.bunshell/config.json`,
}

export function get(key = false) {
	if (!fs.pathExistsSync(PATHS.config)) {
		return false;
	}
	const json = JSON.parse(fs.readFileSync(PATHS.config));
	if (key === false) {
		return json;
	}

	if (json[key]) {
		return json[key];
	}

	return false;
}

export function update(key, value) {
	let json = {};
	if (fs.pathExistsSync(PATHS.config)) {
		json = get();
	}

	json[key] = value;

	fs.writeFileSync(PATHS.config, JSON.stringify(json, null, 4), {
		encoding: "utf8",
	});
}