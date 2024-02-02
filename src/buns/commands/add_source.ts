import { PATHS, update } from '../config';
import { getSources } from '../sources';
import { relinkBins } from './link';

export const desc = 'Add an additional directory to use as script source.';
export const usage = 'bunshell add_source';


export async function addSourceDirectory(target?: string) {

	const sources = await getSources();
	const defaultSource = `${PATHS.bunshell}/default`;

	if (!target) {
		const sourcePath = `Enter full path to source directory:\n${chalk.gray(
			`Default: ${defaultSource}`
		)}\n> `;
		target = (await prompt(sourcePath)) || defaultSource;
	}

	const sourceDirectories = sources.map((source) => source.path);
	if (sourceDirectories.includes(target)) {
		console.log(`The path "${chalk.bold(target)}" already exists. Please choose another path.`);
		return await addSourceDirectory();
	}

	console.log(chalk.dim(`If you namespace this source, all your scripts within that dir will be prefixed with the namespace.`))
	console.log(chalk.dim(`For example, if you add a source with the namespace "foo", a script called "bar" will be available as "foo bar".`))
	console.log(chalk.dim(`If you don't want to namespace, just press enter and your scripts will be available globally.`))
	const namespace = prompt("Namespace (optional):") || undefined;

	target = path.resolve(target);
	sources.push({
		namespace,
		path: target,
		scripts: []
	});
	fs.ensureDirSync(target)

	await update("sources", sources);
}

export default async function () {
	const sourceDir = argv._[0];
	if (sourceDir && !fs.pathExistsSync(sourceDir)) {
		console.log(
			`The path you provided doesn't exist. Are you sure it's correct?`,
		);
		console.log(path.resolve(sourceDir));
		if (!(ack("\nContinue?"))) {
			return;
		}
	}
	await addSourceDirectory(sourceDir);

	// After a new directory is added, it might need to relink
	await relinkBins();
}