/**
 * Remove bin files from the bin directory that don't have a matching script.
 * @autohelp
 */
import { getSources, type Source } from '@lib/sources';
import { PATHS } from '@lib/config';
import { getBins } from './reload';

export async function getExpectedBins(sources: Source[]) {
	return new Set(
		(
			await Promise.all(
				sources.map(async source => {
					const uniqueScripts = new Map(source.scripts.map(script => [script.source, script]));
					const uniqueList = Array.from(uniqueScripts.values());

					if (source.namespace) {
						const globals = uniqueList.flatMap(script => script.globalAliases);
						return [source.namespace, ...globals];
					}

					return uniqueList.flatMap(script => [
						script.slug,
						...script.alias,
						...script.globalAliases,
					]);
				}),
			)
		).flat(),
	);
}

export default async function () {
	console.log('Cleaning up the the bin directory.');

	const realBins = await getBins();
	const sources = await getSources();

	const expectedBins = await getExpectedBins(sources);
	if (await Bun.file(path.join(PATHS.bins, 'bm')).exists()) {
		expectedBins.add('bm');
	}

	for (const binary of realBins) {
		const name = path.basename(binary);
		if (expectedBins.has(name)) {
			continue;
		}

		if (ack(`Delete ${name}?`, 'y')) {
			await $`rm ${binary}`;
		}
	}

	console.log('Bins directory is clean!');
}
