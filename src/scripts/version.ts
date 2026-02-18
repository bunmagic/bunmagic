import { resolve } from '../files';
import { readJsonFile } from '../lib/json';

/**
 * Display the current version of bunmagic
 * @autohelp
 * @alias -v
 */

type PackageJson = {
	version: string;
};

export async function getVersion() {
	const packageFile = resolve(import.meta.dir, '../../package.json');
	const json = await readJsonFile<PackageJson>(packageFile);
	if (!json || 'version' in json !== true) {
		throw new Exit('package.json is missing the version field');
	}

	return json.version;
}

export default async function () {
	console.log(await getVersion());
}
