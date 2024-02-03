import { PATHS } from '../lib/config';
import { getSources } from '../lib/sources';

export const desc = "Ensure all your script files have an executable in the bin directory.";
export const usage = `bunshell bins [--force]`;

function template(scriptPath: string, exec: string): string {
	let output = "#!/bin/bash\n";
	output += `${exec} ${scriptPath} $@`;
	return output;
}


export async function getBins(): Promise<string[]> {
	return (await $`ls ${PATHS.bins}`.text()).split("\n");
}


export async function ensureBin(binName: string, targetPath: string, namespace = false) {
	const exec = namespace ? "bunshell-exec-namespace" : "bunshell-exec";
	const binPath = path.join(PATHS.bins, binName);

	if (argv.force === true && (await Bun.file(binPath).exists()) === true) {
		console.log(`Removing ${ansis.bold(binName)} bin file`);
		await $`rm ${binPath}`
	}

	if (false !== await Bun.file(binPath).exists()) {
		return false;
	}

	// Create bin
	await ensureDir(PATHS.bins);
	await Bun.write(binPath, template(targetPath, exec));
	await $`chmod +x ${binPath}`;

	console.log(`Created new bin: ${binName} -> ${binPath}\n`);
	return binPath;
}



export async function relinkBins() {
	let count = 0;
	for (const source of await getSources()) {

		if (source.namespace) {
			if (await ensureBin(source.namespace, source.path, true)) {
				count++;
			}
		} else {
			for (const script of source.scripts) {
				if (await ensureBin(script.slug, script.file, false)) {
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