import {getScripts, getSources} from '@lib/sources';
import {getBins} from './reload';

export const desc = 'Remove bin files from the bin directory that don\'t have a matching script.';

export default async function () {
	console.log('Cleaning up the the bin directory.');

	const realBins = await getBins();
	const sources = await getSources();

	const expectedBins = new Set(await Promise.all(sources.flatMap(async source => {
		if (source.namespace) {
			return source.namespace;
		}

		const {scripts} = await getScripts(source.dir, source.namespace);
		return scripts.map(script => script.slug);
	})));

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
