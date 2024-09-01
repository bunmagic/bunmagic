
import {
	getPathScripts,
} from '@lib/scripts';
import { update, get, type SourcePaths } from '@lib/config';
import type { Script } from '@lib/script';
import { parseInput } from './parse-input';

export type Source = SourcePaths & {
	scripts: Script[];
};

async function getValidSources(): Promise<Array<SourcePaths>> {
	const sourceConfig = await get('sources');
	if (!sourceConfig) {
		throw new Error('No sources defined.');
	}

	const validSources = await Promise.all(sourceConfig.map(async source => {
		if (source.dir && !await isDirectory(source.dir)) {
			console.warn(`Path ${source.dir} does not exist`);
			if (ack(`Remove ${source.dir} from sources?`)) {
				console.log(`Removing ${source.dir} from sources`);
				return null;
			}
		}

		return source;
	}));

	const filteredSources = validSources.filter((source): source is SourcePaths => source !== null);

	if (filteredSources.length !== sourceConfig.length) {
		await update('sources', filteredSources);
	}

	if (filteredSources.length === 0) {
		throw new Error('No valid sources remaining.');
	}

	return filteredSources;
}

export async function getSources(): Promise<Array<Source>> {
	const validatedSources = await getValidSources();
	const sources = Promise.all(validatedSources.map(async source => {
		const scripts = await getPathScripts(source.dir, source.namespace);
		return {
			dir: source.dir,
			namespace: source.namespace,
			scripts: Array.from(scripts.values()),
		};
	}));

	return sources;
}

export async function findScript<T extends string>(query: T): Promise<Script | undefined> {
	const sources = await getSources();
	const { slug, namespace } = parseInput(query);

	if (namespace) {
		const source = sources.find(source => source.namespace === namespace);
		if (source) {
			const result = source.scripts.find(s => s.slug === slug);
			if (result) {
				return result;
			}
		}
	} else if (!namespace && slug) {
		// No namespace found. Maybe the source exists globally.
		const noNsSources = sources.filter(source => !source.namespace);
		for (const source of noNsSources) {
			const result = source.scripts.find(s => s.command === slug);
			if (result) {
				return result;
			}
		}
	}
}

export async function findNamespace<T extends string>(query: T): Promise<Source | undefined> {
	const sources = await getSources();
	const { slug, namespace } = parseInput(query);

	if (!namespace && slug) {
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

