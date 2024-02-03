import { PATHS, SUPPORTED_FILES, get, type Script, type NamespacedScripts, type Scripts } from "./config";


export async function listScripts(target: string): Promise<string[]> {
	const result = (await $`ls ${target}`.text()).split("\n")
		.map((file: string) => `${target}/${file}`)
		.filter((file: string) => SUPPORTED_FILES.some((ext: string) => file.endsWith(ext)));
	return result;
}

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

async function getScripts(source: Scripts | NamespacedScripts): Promise<(Scripts | NamespacedScripts)> {
	const files = await listScripts(source.path);
	const scripts = await Promise.all(files.map((file) => getScript(file, source.namespace)));
	return {
		...source,
		scripts
	}
}

export async function getSource(name: string): Promise<Scripts | NamespacedScripts> {
	const sources = await get("sources");
	if (!sources) {
		throw new Error("No sources defined.");
	}
	const source = sources.find(source => path.basename(source.path) === name);
	if (!source) {
		throw new Error(`No source found with the name: ${name}`);
	}
	return await getScripts(source);
}

export async function getSources(): Promise<(Scripts | NamespacedScripts)[]> {
	const sources = await get("sources");
	if (!sources) {
		throw new Error("No sources defined.");
	}

	const output: Promise<(Scripts | NamespacedScripts)>[] = [];
	for (const source of sources) {
		output.push(getScripts(source));
	}

	return Promise.all(output);
}


export async function search(command: string): Promise<Script | undefined> {
	const sources = await getSources();
	const scripts = sources.flatMap(source => source.scripts);
	return scripts.find(script => script.command === command);
}

