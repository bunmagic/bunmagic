/**
 * Symlink all your sources to the bunmagic root directory for easy editing.
 * @flag [--link-src] The directory to link the sources to. Default: ~/.bunmagic/sources
 * @flag [--remove] Remove the symlinks.
 */
import { PATHS } from '@lib/config';
import { getSources } from '@lib/sources';

async function linkSource(source: string, target: string) {
	console.log(ansis.green.dim(` Linking: ${ansis.reset(source)}\n To:      ${ansis.reset(target)}\n`));
	await $`ln -s ${source} ${target}`;
}

export default async function symlinkSources() {
	const targetSource = flags['link-src'] && typeof flags['link-src'] === 'string'
		? flags['link-src']
		: `${$HOME}/.bunmagic/sources`;

	if (flags.remove) {
		if (ack(`Remove ${targetSource}?`)) {
			await $`rm -rf ${targetSource}`;
		}
		return;
	}
	const sources = await getSources();
	const dirs = sources.map((source) => source.dir);
	await ensureDirectory(targetSource);

	for (const source of dirs) {
		console.log(source);
		const dirName = path.basename(source);
		if (source.startsWith(PATHS.bunmagic)) {
			console.log(ansis.yellow.dim(` Skipping: ${ansis.reset(source)}\n`));
			continue;
		}
		await linkSource(source, `${targetSource}/${dirName}`);
	}

}

