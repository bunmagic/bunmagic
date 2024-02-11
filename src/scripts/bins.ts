import {PATHS} from '@lib/config';
import {getSources} from '@lib/sources';

export const desc = 'Ensure all your script files have an executable in the bin directory.';
export const usage = 'bun-magic bins [--force]';

function template(name: string, scriptPath: string, exec: string): string {
	let output = '#!/bin/bash\n';
	output += `${exec} ${scriptPath} ${name} $@`;
	return output;
}

export async function getBins(): Promise<string[]> {
	const result = await $`ls ${PATHS.bins}`.text();
	return result.split('\n');
}

export async function ensureBin(binaryName: string, targetPath: string, namespace = false) {
	const exec = namespace ? 'bun-magic-exec-namespace' : 'bun-magic-exec';
	const binaryPath = path.join(PATHS.bins, binaryName);

	if (argv.force === true && await Bun.file(binaryPath).exists()) {
		console.log(`Removing ${ansis.bold(binaryName)} bin file`);
		await $`rm ${binaryPath}`;
	}

	if (await Bun.file(binaryPath).exists()) {
		return false;
	}

	// Create bin
	await ensureDirectory(PATHS.bins);
	await Bun.write(binaryPath, template(binaryName, targetPath, exec));
	await $`chmod +x ${binaryPath}`;

	console.log(`Created new bin: ${binaryName} -> ${binaryPath}\n`);
	return binaryPath;
}

export async function relinkBins() {
	let count = 0;
	for (const source of await getSources()) {
		if (source.namespace) {
			if (await ensureBin(source.namespace, source.dir, true)) {
				count++;
			}
		} else {
			for (const script of source.scripts) {
				if (await ensureBin(script.slug, script.source, false)) {
					count++;
				}
			}
		}
	}

	return count > 0;
}

export default async function () {
	if (await relinkBins()) {
		console.log('\nDone!');
	} else {
		console.log('All executables are already linked.');
		console.log(ansis.gray('Use the --force if you must'));
	}
}
