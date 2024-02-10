import { PATHS, SUPPORTED_FILES, get, type Script, type Namespace, type ScriptCollection } from "./config";


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

export async function getScripts(sourcePath: string, namespace?: string): Promise<(ScriptCollection | Namespace)> {
	const files = await listScripts(sourcePath);
	const scripts = await Promise.all(files.map((file) => getScript(file, namespace)));
	return {
		path: sourcePath,
		namespace,
		scripts
	}
}

export async function getSource(name: string): Promise<ScriptCollection | Namespace> {
	const sources = await get("sources");
	if (!sources) {
		throw new Error("No sources defined.");
	}
	const source = sources.find(source => path.basename(source.path) === name);
	if (!source) {
		throw new Error(`No source found with the name: ${name}`);
	}
	return await getScripts(source.path, source.namespace);
}

export async function getSources(): Promise<(ScriptCollection | Namespace)[]> {
	const sources = await get("sources");
	if (!sources) {
		throw new Error("No sources defined.");
	}

	const output: Promise<(ScriptCollection | Namespace)>[] = [];
	for (const source of sources) {
		output.push(getScripts(source.path, source.namespace));
	}

	return Promise.all(output);
}

export function commandFromStr(input: string): [string, string | undefined] {
	const arr = input.split(" ");
	if (arr.length === 1) {
		return [arr[0], undefined];
	}
	if (arr.length === 2) {
		return [arr[1], arr[0]];
	}

	throw new Error("A command should consist of 1 or 2 words.");
}

export async function findScript(query: string): Promise<Script | undefined> {
	const sources = await getSources();
	const [script, namespace] = commandFromStr(query);

	if (namespace) {
		const source = sources.find(source => source.namespace === namespace);
		if (source) {
			const scriptSource = source?.scripts.find(s => s.slug === script);
			if (scriptSource) {
				return scriptSource;
			}
		}
	} else if (!namespace && script) {
		// No namespace found. Maybe the source exists globally.
		const noNsSources = sources.filter(source => !source.namespace);
		const scripts = noNsSources.flatMap(source => source.scripts);
		return scripts.find(s => s.command === script);
	}
}

export async function findNamespace(query: string): Promise<Namespace | undefined> {
	const sources = await getSources();
	const [script, namespace] = commandFromStr(query);

	if (!namespace && script) {
		// Check if maybe only the namespace was passed in
		const source = sources.find(source => source.namespace === script);
		if (source) {
			return source as Namespace;
		}
	}
}

export async function findAny(query: string): Promise<Script | Namespace | undefined> {
	const script = await findScript(query);
	if (script) {
		return script;
	}

	const namespace = await findNamespace(query);
	if (namespace) {
		return namespace;
	}
}

