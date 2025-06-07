/**
 * Display the current version of bunmagic
 * @usage [[version | -v]]
 * @alias -v
 */
import { Exit, SAF } from 'bunmagic';

type PackageJson = {
	version: string;
};

export async function getVersion() {
	const packageFile = SAF.from(import.meta.dir, '../../package.json');
	const json = await packageFile.json<PackageJson>();
	if ('version' in json !== true) {
		throw new Exit('package.json is missing the version field');
	}

	return json.version;
}

export default async function () {
	console.log(await getVersion());
}
