import { ensureBin } from '../lib/bins';
import { getSources } from '../lib/sources';

export const desc = "Ensure all your script files have an executable in the bin directory.";
export const usage = `bunshell link [--force]`;

export async function relinkBins() {
	let count = 0;
	for (const source of await getSources()) {

		if (source.namespace) {
			if (await ensureBin(source.namespace, source.path, true)) {
				count++;
			}
		} else {
			for (const script of source.scripts) {
				if (await ensureBin(script.slug, script.path)) {
					count++;
				}
			}
		}
	}
	return count > 0;
}

export default async function () {
	if (await relinkBins()) {
		console.log("\nDone!");
	} else {
		console.log("All executables are already linked.");
		console.log(ansis.gray("Use the --force if you must"));
	}
}