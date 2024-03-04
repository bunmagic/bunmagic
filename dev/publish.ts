// name: Publish
// desc: Publishes the package to npm
// usage: bmdev publish
import semver, { type ReleaseType } from 'semver';

type PackageJson = {
	version: string;
};
if (ack('Increment version number?')) {
	const packageFile = path.resolve(import.meta.dir, '../package.json');
	const packageJson = await Bun.file(packageFile).json<PackageJson>();

	const increments: ReleaseType[] = ['prerelease', 'major', 'minor', 'patch'];
	const increment = await selection('What kind of patch is this?', increments);
	const cv = semver.parse(packageJson.version);
	if (!cv) {
		throw new Error('Invalid version');
	}

	const nv = semver.inc(cv, increment);
	if (nv) {
		packageJson.version = nv;
		await Bun.write(packageFile, JSON.stringify(packageJson, null, 2));
		console.log(`\nUpdated version from ${cv.version} to ${nv}`);
	}
}

if (ack('Do you want to publish this version?')) {
	const projectPath = path.resolve(import.meta.dir, '..');
	cd(projectPath);
	await $`npm publish > /dev/tty`;
	console.log('Done!');
}
