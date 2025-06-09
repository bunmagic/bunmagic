/**
 * Remove a directory from the script source list.
 */
import * as config from '@lib/config';
import { PATHS } from '@lib/config';
import { getSources } from '@lib/sources';
import { reloadBins } from './reload';

export async function removeSourceDirectory(target?: string): Promise<void> {
	const sources = (await config.get('sources')) || [];
	if (!target) {
		const sourceDirectories = sources.map(source => source.dir);
		if (sourceDirectories.length === 0) {
			throw new Error('No source directories to remove.');
		}

		target = await select('Select a directory to remove:', sourceDirectories);
	}

	const fullPath = path.resolve(target);
	console.log(ansis.dim(`Unlinking ${fullPath}`));

	if (!ack('Are you sure?')) {
		throw new Error('Operation cancelled by the user.');
	}

	const updatedSources = sources.filter(source => source.dir !== target);
	if (sources.length === updatedSources.length) {
		throw new Error(`The path "${target}" does not exist in the source list.`);
	}

	await config.update('sources', updatedSources);
	console.log(`Removed "${target}" from the source list.`);
}

async function cleanBins() {
	const sources = await getSources();
	const allBins = new Set(
		sources.flatMap(source =>
			source.scripts
				? source.scripts.flatMap(script => [
						script.bin,
						...(script.alias ? script.alias.map(alias => `${PATHS.bins}/${alias}`) : []),
					])
				: [],
		),
	);
	allBins.add(`${PATHS.bins}/bm`);
	const binFiles = new Bun.Glob('*');
	for await (const binName of binFiles.scan(PATHS.bins)) {
		const binFile = `${PATHS.bins}/${binName}`;
		if (!allBins.has(binFile)) {
			console.log(ansis.dim(`Removing ${binFile}`));
			await $`rm ${binFile}`;
		}
	}
}

export default async function () {
	const directory = args[0];
	const cwd = process.cwd();

	const sources = await getSources();
	const sourceExists = (targetDirectory: string): boolean =>
		sources.some(source => source.dir === targetDirectory);

	try {
		if (directory && !sourceExists(directory)) {
			// 1 - Directory provided, but doesn't exist
			console.log(`The path "${directory}" does not exist in the source list.`);
			return false;
		}

		if (!directory && !sourceExists(cwd)) {
			// 2 - Directory not provided, Using CWD, but doesn't exist
			console.log(
				`The current working directory "${cwd}" does not exist in the source list. Selecting from available sources.`,
			);
			await removeSourceDirectory();
		} else if (directory && sourceExists(directory)) {
			// 3 - Directory provided, exists
			await removeSourceDirectory(directory);
		} else if (
			!directory &&
			sourceExists(cwd) &&
			ack(`Do you want to delete the current working directory ${cwd}?`)
		) {
			// 4 - Directory not provided, Using CWD, exists
			await removeSourceDirectory(cwd);
		}

		// Remove any bins that are no longer in use
		await cleanBins();
		// Make sure all the bins are up to date
		await reloadBins();
	} catch (error) {
		console.error(error);
		return false;
	}
}
