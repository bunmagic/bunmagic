
import {
	getPathScripts,
} from '@lib/scripts';
import {get, type SourcePaths} from '@lib/config';
import type {Script} from '@lib/script';

export type Source = SourcePaths & {
	scripts: Script[];
};
export async function getSources(): Promise<Array<Source>> {
	const sourceConfig = await get('sources');
	if (!sourceConfig) {
		throw new Error('No sources defined.');
	}

	const sources: Source[] = [];
	for (const source of sourceConfig) {
		const commands = await getPathScripts(source.dir, source.namespace);

		const scripts: Script[] = Array.from(commands.scripts)
			.filter(
				(entry): entry is [string, Script] => entry[1].type === 'script',
			).map(entry => entry[1]);

		sources.push({
			dir: source.dir,
			namespace: source.namespace,
			scripts,
		});
	}

	return sources;
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
			const result = source.scripts.find(s => s.command === script);
			if (result) {
				return result;
			}
		}
	} else if (!namespace && script) {
		// No namespace found. Maybe the source exists globally.
		const noNsSources = sources.filter(source => !source.namespace);
		for (const source of noNsSources) {
			const result = source.scripts.find(s => s.command === script);
			if (result) {
				return result;
			}
		}
	}
}

export async function findNamespace<T extends string>(query: T): Promise<Source | undefined> {
	const sources = await getSources();
	const [script, namespace] = commandFromString(query);

	if (!namespace && script) {
		// Check if maybe only the namespace was passed in
		const source = sources.find((source): source is Source => source.namespace === query);
		if (source) {
			return source;
		}
	}

	return undefined;
}

export async function findAny<T extends string>(query: T): Promise<Script | Source | undefined> {
	const script = await findScript(query);
	if (script) {
		return script;
	}

	const namespace = await findNamespace(query);
	if (namespace) {
		return namespace;
	}
}

