import { getBins } from "../lib/bins";
import { getSources } from '../lib/sources';

export const desc = "Remove bin files from the bin directory that don't have a matching script.";
export const usage = `bunshell clean`;

export default async function () {
	console.log("Cleaning up the the bin directory.");

	const realBins = await getBins();
	const sources = await getSources();

	const expectedBins = sources.flatMap(source => {
		if ('namespace' in source) {
			return source.namespace;
		}
		return source.scripts.map(script => script.slug);
	});

	for (const bin of realBins) {
		const name = path.basename(bin);
		if (expectedBins.includes(name)) {
			continue;
		}
		if (ack(`Delete ${name}?`, "y")) {
			await $`rm ${bin}`;
		}
	}

	console.log("Bins directory is clean!");
}