import { ensureBin } from '../bins';
import { getSources } from '../sources';

export const desc = "Ensure all your script files have an executable in the bin directory.";
export const usage = `bunshell link [--force]`;

export async function relinkBins() {
	let count = 0;
	for (const source of await getSources()) {

		if ('namespace' in source) {
			if (await ensureBin({
				slug: source.namespace,
				path: source.path
			})) {
				count++;
			}
		} else {
			for (const script of source.scripts) {
				if (await ensureBin({
					slug: script.slug,
					path: script.path
				})) {
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
		console.log(chalk.gray("Use the --force if you must"));
	}
}