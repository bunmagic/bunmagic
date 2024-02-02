import { PATHS, SUPPORTED_FILES, get, type Script, type NamespacedScripts, type Scripts } from "./config";

async function getScript(file: string, parent?: string): Promise<Script> {
	const slug = path.parse(file).name;
	const filename = path.parse(file).base;
	const bin = `${PATHS.bins}/${slug}`;
	const directory = path.dirname(file);
	const command = parent ? `${parent} ${slug}` : slug;
	return {
		slug,
		bin,
		file,
		filename,
		command,
		path: directory
	};
}

async function getScripts(directory: string, parent?: string): Promise<Script[]> {
	const files = await globby(`${directory}/*.{${SUPPORTED_FILES.join(",")}}`);
	return Promise.all(files.map((file) => getScript(file, parent)));
}

export async function getSources(): Promise<(Scripts | NamespacedScripts)[]> {
	const sources = await get("sources");
	if (!sources) {
		throw new Error("No sources defined.");
	}

	const output: (Scripts | NamespacedScripts)[] = [];
	for (const source of sources) {
		const scripts = await getScripts(source.path, 'namespace' in source ? source.namespace : undefined);
		output.push({
			...source,
			scripts
		});
	}

	return output;
}


export async function search(command: string): Promise<Script | undefined> {
	const sources = await getSources();
	const scripts = sources.flatMap(source => source.scripts);
	return scripts.find(script => script.command === command);
}

