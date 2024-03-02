import * as config from '@lib/config';
import {getSources, type Source} from '@lib/sources';
import {reloadBins} from './reload';

export const desc = 'Remove a directory from the script source list.';

export async function removeSourceDirectory(target?: string) {
	const sources = (await config.get('sources')) || [];
	if (!target) {
		const sourceDirectories = sources.map(source => source.dir);
		if (sourceDirectories.length === 0) {
			console.log('No source directories to remove.');
			return;
		}

		try {
			target = await selection(sourceDirectories, 'Select a directory to remove:');
		} catch {
			console.log('Selection was cancelled or an invalid selection was made.');
			return;
		}
	}

	const fullPath = path.resolve(target);
	console.log(ansis.dim(`Unlinking ${fullPath}`));
	if (!ack('Are you sure?')) {
		return;
	}

	const updatedSources = sources.filter(source => source.dir !== target);
	if (sources.length === updatedSources.length) {
		console.log(`The path "${target}" does not exist in the source list.`);
		return;
	}

	await config.update('sources', updatedSources);
	console.log(`Removed "${target}" from the source list.`);
}

export default async function () {
	const directory = argv._[0] || process.cwd();
	await removeSourceDirectory(directory);

	// After a directory is removed, it might need to relink
	await reloadBins();
}
