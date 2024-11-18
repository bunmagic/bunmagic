/**
 * Publishes the package to npm
 */
import semver, { type ReleaseType } from 'semver';
import 'bunmagic/globals'; // eslint-disable-line import/no-unassigned-import

type PackageJson = {
	version: string;
};
if (ack('Increment version number?')) {
	const pkg = SAF.from(import.meta.dir, 'package.json');
	const json = await pkg.json<PackageJson>();

	const increments: ReleaseType[] = ['prerelease', 'major', 'minor', 'patch'];
	const increment = await select('What kind of patch is this?', increments);
	const cv = semver.parse(json.version);
	if (!cv) {
		throw new Error('Invalid version');
	}

	const nv = semver.inc(cv, increment);
	if (nv) {
		json.version = nv;
		await pkg.json(json);
		console.log(`\nUpdated version from ${cv.version} to ${nv}`);
	}
}

if (ack('Do you want to publish this version?')) {
	const projectPath = path.resolve(import.meta.dir, '..');
	cd(projectPath);
	await $`bun run --bun build`;
	await $`npm publish > /dev/tty`;
	console.log('Done!');
}
