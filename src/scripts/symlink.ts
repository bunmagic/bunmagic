/**
 * Symlink all your sources to the bunmagic root directory for easy editing.
 * @flag [--target] The directory to link the sources to. Default: ~/.bunmagic
 * @flag [--remove] Remove the symlinks.
 */
import { getSources } from '@lib/sources';

async function linkSource(source: string, target: string) {

	let targetPath = target;
	let targetDirectory = target;
	let targetIsFile = false;
	if (await isDirectory(source)) {
		targetPath = path.join(target, path.basename(source));
		targetDirectory = targetPath;
	} else {
		targetIsFile = true;
	}

	if (flags.remove) {
		if (await isDirectory(targetPath)) {
			console.log(` Removing Dir: ${targetPath}`);
			return await $`rm -rf ${targetPath}`;
		} else if (await Bun.file(targetPath).exists()) {
			console.log(` Removing File: ${targetPath}`);
			return await $`rm ${targetPath}`;
		}
		console.log(ansis.dim(` Symlink Doesn't exist: ${ansis.reset(targetPath)}`));
		return;
	}

	// Skip already existing files
	if (targetIsFile && await Bun.file(targetPath).exists()) {
		console.log(ansis.yellow.dim(` Skipping File: ${ansis.reset(targetPath)}`));
		return;
	}

	// Skip already existing directories
	if (await isDirectory(targetPath)) {
		console.log(ansis.yellow.dim(` Skipping Dir: ${ansis.reset(targetPath)}`));
		return;
	}

	console.log(ansis.green.dim(` Linking: ${ansis.reset(source)}\n To:      ${ansis.reset(target)}\n`));
	await $`ln -s ${source} ${target}`;
}

async function symlinkBunmagic(target: string) {
	const which = await $`which bunmagic`.text();
	if (which.trim() === '') {
		throw new Error('Bunmagic is not installed.');
	}
	const binPath = await $`readlink -f ${which}`.text();
	const bunmagicDir = path.resolve(binPath, '../../..');

	await linkSource(bunmagicDir, target);
	await linkSource(`${bunmagicDir}/types`, target);
	await linkSource(`${bunmagicDir}/tsconfig.sources.json`, path.join(target, 'tsconfig.json'));
}

export default async function symlinkSources() {

	const target = flags['target'] && typeof flags['target'] === 'string'
		? resolveTilde(flags['target'])
		: `${$HOME}/.bunmagic/`;

	const sources = await getSources();
	const dirs = sources.map((source) => source.dir);

	const sourcesDirectory = path.join(target, 'sources');
	await ensureDirectory(target);
	await ensureDirectory(sourcesDirectory);
	for (const source of dirs) {
		await linkSource(source, sourcesDirectory);
	}
	await symlinkBunmagic(target);
}

