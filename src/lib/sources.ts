import type {Script, Scripts} from '@lib/commands';
import {
	PATHS, SUPPORTED_FILES, get, type Collection,
} from '@lib/config';

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

export async function getScripts<T extends string | undefined>(sourcePath: string, namespace?: T): Promise<Collection<T> & Scripts> {
	const files = await listScripts(sourcePath);
	const scripts = await Promise.all(files.map(async file => getScript(file, namespace)));
	return {
		dir: sourcePath,
		namespace: namespace as Collection<T>['namespace'],
		scripts,
	};
}

export async function getSource(name: string): Promise<Collection> {
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

export async function getSources(): Promise<Collection[]> {
	const sources = await get('sources');
	if (!sources) {
		throw new Error('No sources defined.');
	}

	const output: Array<Promise<Collection>> = [];
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

export async function findScript<T extends string>(query: T): Promise<Script | undefined> {
	const sources = await getSources();
	const [script, namespace] = commandFromString(query);

	if (namespace) {
		const source = sources.find(source => source.namespace === namespace);
		if (source) {
			const sourceWithScripts = await getScripts(source.dir, source.namespace);
			const result = sourceWithScripts.scripts.find(s => s.command === script);
			if (result) {
				return result;
			}
		}
	} else if (!namespace && script) {
		// No namespace found. Maybe the source exists globally.
		const noNsSources = sources.filter(source => !source.namespace);
		for (const source of noNsSources) {
			const sourceWithScripts = await getScripts(source.dir);
			const result = sourceWithScripts.scripts.find(s => s.command === script);
			if (result) {
				return result;
			}
		}
	}
}

export async function findNamespace<T extends string>(query: T): Promise<Collection<T> | undefined> {
	const sources = await getSources();
	const [script, namespace] = commandFromString(query);

	if (!namespace && script) {
		// Check if maybe only the namespace was passed in
		const source = sources.find((source): source is Collection<T> => source.namespace === query);
		if (source) {
			return source;
		}
	}

	return undefined;
}

export async function findAny<T extends string>(query: T): Promise<Script | Collection<T> | undefined> {
	const script = await findScript(query);
	if (script) {
		return script;
	}

	const namespace = await findNamespace(query);
	if (namespace) {
		return namespace;
	}
}

