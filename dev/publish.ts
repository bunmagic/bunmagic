import semver from 'semver';

if (ack("Increment version number?")) {
	const pkgFile = path.resolve(import.meta.dir, "../package.json");
	const pkgJson = await Bun.file(pkgFile).json();

	const increments = ['prerelease', 'major', 'minor', 'patch'];
	const increment = selection(increments, "What kind of patch is this?");
	const cv = semver.parse(pkgJson.version);
	const nv = semver.inc(cv, increment);

	pkgJson.version = nv;
	await Bun.write(pkgFile, JSON.stringify(pkgJson, null, 2));
	console.log(`\nUpdated version from ${cv} to ${nv}`);
}

if (ack("Do you want to publish this version?")) {
	await $`npm publish > /dev/tty`
	console.log(`Done!`);
}