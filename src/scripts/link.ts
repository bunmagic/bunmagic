import {
	PATHS, update, type Collection,
} from '@lib/config';
import {getSources} from '@lib/sources';
import {reloadBins} from './reload';

export const desc = 'Add an additional directory to use as script source.';
export const usage = 'bunmagic link';

export async function addSourceDirectory(target?: string) {
	const sources = await getSources().catch(() => [] as Collection[]);
	let defaultSource = `${PATHS.bunmagic}/default`;

	if (sources.some(source => source.dir === defaultSource)) {
		defaultSource = process.cwd();
	}

	if (!target) {
		const sourcePath = `Enter full path to source directory:\n${ansis.gray(
			`Leave empty to use: ${ansis.bold(defaultSource)}`,
		)}\n> `;
		target = prompt(sourcePath) || defaultSource;
	}

	const sourceDirectories = sources.map(source => source.dir);
	if (sourceDirectories.includes(target)) {
		console.log(`The path "${ansis.bold(target)}" already exists. Please choose another path.`);
		await addSourceDirectory();
		return;
	}

	console.log(ansis.dim('If you namespace this source, all your scripts within that dir will be prefixed with the namespace.'));
	console.log(ansis.dim('For example, if you add a source with the namespace "foo", a script called "bar" will be available as "foo bar".'));
	console.log(ansis.dim('If you don\'t want to namespace, just press enter and your scripts will be available globally.'));
	const namespace = prompt('Namespace (optional):') || undefined;

	target = path.resolve(target);
	sources.push({
		namespace,
		dir: target,
		scripts: [],
	});
	await ensureDirectory(target);
	await update('sources', sources);
}

export default async function () {
	const directory = argv._[0];
	if (directory && !await Bun.file(directory).exists() && !await isDirectory(directory)) {
		console.log(
			'The path you provided doesn\'t exist. Are you sure it\'s correct?',
		);
		console.log(path.resolve(directory));
		if (!(ack('\nContinue?'))) {
			return;
		}
	}

	await addSourceDirectory(directory);

	// After a new directory is added, it might need to relink
	await reloadBins();
}
