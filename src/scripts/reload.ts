import {PATHS} from '@lib/config';
import {getSources} from '@lib/sources';

export const desc = 'Reload your script files and ensure that they have an executable bin.';
export const usage = '[--force]';

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
	const exec = namespace ? 'bunmagic-exec-namespace' : 'bunmagic-exec';
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

export async function reloadBins() {
	let count = 0;
	for (const source of await getSources()) {
		if (source.namespace) {
			if (await ensureBin(source.namespace, source.dir, true)) {
				count++;
			}
		} else {
			const {scripts} = source;
			for (const script of scripts) {
				if (await ensureBin(script.slug, script.source, false)) {
					count++;
				}
			}
		}
	}

	return count > 0;
}

export default async function () {
	if (await reloadBins()) {
		console.log('\nDone!');
	} else {
		console.log('All executables are already linked.');
		console.log(ansis.gray('Use the --force if you must'));
	}
}
