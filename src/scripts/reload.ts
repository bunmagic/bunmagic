/**
 * Reload your script files and ensure that they have an executable bin.
 * Use `--force` if you want to force the creation of the bin files
 * @usage [[--force]]
 */

import { PATHS } from '@lib/config';
import type { Script } from '@lib/script';
import { getSources } from '@lib/sources';

function template(name: string, scriptPath: string, exec: string): string {
	let output = '#!/bin/bash\n';
	output += `${exec} ${scriptPath} ${name} $@`;
	return output;
}

export async function getBins(): Promise<string[]> {
	return glob('*', { cwd: PATHS.bins });
}

export async function ensureScriptBin(script: Script) {
	const exec = 'bunmagic-exec';
	const bin = SAF.from(PATHS.bins, script.slug);
	if (flags.force === true && (await bin.file.exists())) {
		console.log(`Removing ${ansis.bold(script.slug)} script bin file`);
		await bin.delete('keep_handle');
	}

	if (await bin.exists()) {
		return false;
	}

	// Create script bin
	await ensureDirectory(PATHS.bins);
	await bin.write(template(script.slug, script.source, exec));
	await $`chmod +x ${script.bin}`;

	if (script.alias.length > 0) {
		for (const alias of script.alias) {
			const aliasBin = SAF.from(PATHS.bins, alias);
			await aliasBin.write(template(script.slug, script.source, exec));
			await $`chmod +x ${aliasBin}`;
			console.log(`Created new script bin: ${script.slug} -> ${aliasBin.file.name}\n`);
		}
	}

	return script.bin;
}

export async function ensureNamespaceBin(binaryName: string, targetPath: string) {
	const exec = 'bunmagic-exec-namespace';
	const binaryPath = path.join(PATHS.bins, binaryName);

	if (flags.force === true && (await Bun.file(binaryPath).exists())) {
		console.log(`Removing ${ansis.bold(binaryName)} namespace bin file`);
		await $`rm ${binaryPath}`;
	}

	if (await Bun.file(binaryPath).exists()) {
		return false;
	}

	// Create namespace bin
	await ensureDirectory(PATHS.bins);
	await Bun.write(binaryPath, template(binaryName, targetPath, exec));
	await $`chmod +x ${binaryPath}`;

	console.log(`Created new namespace bin: ${binaryName} -> ${binaryPath}\n`);
	return binaryPath;
}

export async function reloadBins() {
	let count = 0;
	for (const source of await getSources()) {
		if (flags.symlink === true) {
			const directory = source.dir;
			const linkPath = path.join(PATHS.bunmagic, 'sources', path.basename(directory));
			if (directory.startsWith(PATHS.bunmagic)) {
				console.log(`Source already in ${PATHS.bunmagic}: ${directory}`);
			} else {
				await $`rm -f ${linkPath}`;
				await ensureDirectory(path.dirname(linkPath));
				await $`ln -s ${directory} ${linkPath}`;
				console.log(`Linked source: ${directory} -> ${linkPath}`);
			}
		}

		if (source.namespace) {
			if (await ensureNamespaceBin(source.namespace, source.dir)) {
				count++;
			}

			continue;
		}

		const { scripts } = source;
		for (const script of scripts) {
			if (await ensureScriptBin(script)) {
				count++;
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
