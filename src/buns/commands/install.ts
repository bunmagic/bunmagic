import { search } from "../sources";

commandInfo.install = {
	desc: "Install a zx script from a remote URL.",
	usage: `bunshell install <url> [--slug <slug>]`
};
async function install(scriptURL) {
	const sourceRequest = await fetch(scriptURL);
	if (sourceRequest.status !== 200) {
		throw new Error(`Could not download script from ${scriptURL}`)
	}
	const source = await sourceRequest.text();

	// Check if the first line is zx
	if (!source.split('\n')[0].includes('#!/usr/bin/env zx')) {
		throw new Error(`Can't install a script that's missing zx shebang.`);
	}

	const slug = argv.slug || path.basename(scriptURL).split('.')[0];

	// Allow overwriting existing bunshell scripts
	const { file } = await search(slug);

	// We'll store the source here
	let targetFile;


	// If the script already exists, ask if we should overwrite it
	if (file) {
		if (false === ack(`Overwrite existing script "${chalk.bold(slug)}"?`)) {
			return false;
		}
		targetFile = file;

	}
	// Otherwise, create a new script
	else {
		targetFile = await create(slug);
	}

	// Write the source to the file if it exists
	if (targetFile && fs.existsSync(targetFile)) {
		fs.writeFile(targetFile, source);
	}
}