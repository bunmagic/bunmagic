/**
 * Symlink all your sources to the bunmagic root directory for easy editing.
 * @flag [--target] The directory to link the sources to. Default: ~/.bunmagic/sources
 * @flag [--remove] Remove the symlinks.
 */
import { PATHS } from '@lib/config';
import { getSources } from '@lib/sources';

async function linkSource(source: string, target: string) {
	console.log(ansis.green.dim(` Linking: ${ansis.reset(source)}\n To:      ${ansis.reset(target)}\n`));
	await $`ln -s ${source} ${target}`;
}

export default async function symlinkSources() {
	const target = flags['target'] && typeof flags['target'] === 'string'
		? resolveTilde(flags['target'])
		: `${$HOME}/.bunmagic/sources/`;

	if (!target.endsWith('/')) {
		throw new Error(`The target path must end with a trailing slash: ${target}`);
	}

	if (flags.remove) {
		if (ack(`Remove ${target}?`)) {
			await $`rm -rf ${target}`;
		}
		return;
	}
	const sources = await getSources();
	const dirs = sources.map((source) => source.dir);
	await ensureDirectory(target);

	for (const source of dirs) {
		if (source.startsWith(PATHS.bunmagic)) {
			console.log(ansis.yellow.dim(` Skipping: ${ansis.reset(source)}\n`));
			continue;
		}
		const dirName = path.basename(source);
		const targetPath = path.join(target, dirName);
		if( await isDirectory(targetPath)) {
			console.log(ansis.yellow.dim(` Skipping: ${ansis.reset(source)}\n`));
			continue;
		}
		await linkSource(source, target);
	}

}

