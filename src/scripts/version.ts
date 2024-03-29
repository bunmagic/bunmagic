/**
* Display the current version of bunmagic
* @usage [[version | -v]]
* @alias -v
*/
type PackageJson = {
	version: string;
};

export async function getVersion() {
	const packageFile = path.resolve(import.meta.dir, '../../package.json');
	const packageJson = await Bun.file(packageFile).json<PackageJson>();
	return packageJson.version;
}

export default async function () {
	console.log(await getVersion());
}
