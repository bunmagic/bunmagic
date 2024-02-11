import {
	PATHS, SUPPORTED_FILES, get, type Script, type Namespace, type ScriptCollection,
} from './config';

export async function listScripts(target: string): Promise<string[]> {
	const result = await $`ls ${target}`.text();
	return result.split('\n')
		.map((file: string) => `${target}/${file}`)
		.filter((file: string) => SUPPORTED_FILES.some((extension: string) => file.endsWith(extension)));
}

async function getScript(file: string, parent?: string): Promise<Script> {
	const slug = path.parse(file).name;
	const filename = path.parse(file).base;
	const binary = `${PATHS.bins}/${slug}`;
	const directory = path.dirname(file);
	const command = parent ? `${parent} ${slug}` : slug;
	return {
		slug,
		bin: binary,
		source: file,
		filename,
		command,
		dir: directory,
	};
}

export async function getScripts(sourcePath: string, namespace?: string): Promise<(ScriptCollection | Namespace)> {
	const files = await listScripts(sourcePath);
	const scripts = await Promise.all(files.map(async file => getScript(file, namespace)));
	return {
		dir: sourcePath,
		namespace,
		scripts,
	};
}

export async function getSource(name: string): Promise<ScriptCollection | Namespace> {
	const sources = await get('sources');
	if (!sources) {
		throw new Error('No sources defined.');
	}

	const source = sources.find(source => path.basename(source.dir) === name);
	if (!source) {
		throw new Error(`No source found with the name: ${name}`);
	}

	return getScripts(source.dir, source.namespace);
}

export async function getSources(): Promise<Array<ScriptCollection | Namespace>> {
	const sources = await get('sources');
	if (!sources) {
		throw new Error('No sources defined.');
	}

	const output: Array<Promise<(ScriptCollection | Namespace)>> = [];
	for (const source of sources) {
		output.push(getScripts(source.dir, source.namespace));
	}

	return Promise.all(output);
}

export function commandFromString(input: string): [string, string | undefined] {
	const array = input.split(' ');
	if (array.length === 1) {
		return [array[0], undefined];
	}

	if (array.length === 2) {
		return [array[1], array[0]];
	}

	throw new Error('A command should consist of 1 or 2 words.');
}

export async function findScript(query: string): Promise<Script | undefined> {
	const sources = await getSources();
	const [script, namespace] = commandFromString(query);

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
	const [script, namespace] = commandFromString(query);

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

