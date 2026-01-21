/**
 * Reload your script files and ensure that they have an executable bin.
 * Use `--force` if you want to force the creation of the bin files
 * @autohelp
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

export async function ensureScriptBin(
	script: Script,
	aliases: string[] = script.alias,
	globalAliases: string[] = script.globalAliases,
) {
	const exec = 'bunmagic-exec';
	const bin = SAF.from(PATHS.bins, script.slug);
	if (flags.force === true && (await bin.file.exists())) {
		console.log(`Removing ${ansis.bold(script.slug)} script bin file`);
		await bin.delete('keep_handle');
	}

	const binExists = await bin.exists();

	let created = 0;

	if (!binExists) {
		// Create script bin
		await ensureDirectory(PATHS.bins);
		await bin.write(template(script.slug, script.source, exec));
		await $`chmod +x ${script.bin}`;
		created += 1;
	}

	created += await ensureAliasBins(script, aliases);
	created += await ensureAliasBins(script, globalAliases);

	return created > 0 ? script.bin : false;
}

async function ensureAliasBins(script: Script, aliases: string[]) {
	const exec = 'bunmagic-exec';
	if (aliases.length === 0) {
		return 0;
	}

	let created = 0;
	for (const alias of new Set(aliases)) {
		if (!alias) {
			continue;
		}

		const aliasBin = SAF.from(PATHS.bins, alias);
		const aliasExists = await aliasBin.exists();
		if (aliasExists && flags.force !== true) {
			continue;
		}

		await ensureDirectory(PATHS.bins);
		await aliasBin.write(template(script.slug, script.source, exec));
		await $`chmod +x ${aliasBin}`;
		console.log(`Created new script bin: ${script.slug} -> ${aliasBin.file.name}\n`);
		created += 1;
	}

	return created;
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
	const claimedAliases = new Set<string>();
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

		const { scripts } = source;
		const seenSources = new Set<string>();

		if (source.namespace) {
			if (await ensureNamespaceBin(source.namespace, source.dir)) {
				count++;
			}

			for (const script of scripts) {
				if (seenSources.has(script.source)) {
					continue;
				}

				seenSources.add(script.source);
				const globals = claimAliases(script.globalAliases, claimedAliases);
				count += await ensureAliasBins(script, globals);
			}

			continue;
		}

		for (const script of scripts) {
			if (seenSources.has(script.source)) {
				continue;
			}

			seenSources.add(script.source);
			const aliases = claimAliases(script.alias, claimedAliases);
			const globals = claimAliases(script.globalAliases, claimedAliases);
			if (await ensureScriptBin(script, aliases, globals)) {
				count++;
			}
		}
	}

	return count > 0;
}

function claimAliases(aliases: string[], claimed: Set<string>) {
	const unique = new Set(aliases);
	const result: string[] = [];
	for (const alias of unique) {
		if (!alias || claimed.has(alias)) {
			continue;
		}

		claimed.add(alias);
		result.push(alias);
	}

	return result;
}

export default async function () {
	if (await reloadBins()) {
		console.log('\nDone!');
	} else {
		console.log('All executables are already linked.');
		console.log(ansis.gray('Use the --force if you must'));
	}
}
