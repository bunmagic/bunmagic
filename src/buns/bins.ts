import { PATHS } from "./config";

function template(scriptPath: string): string {
	let output = "#!/bin/bash\n";
	output += `bun run ${PATHS.source} ${scriptPath} $@`;
	return output;
}


export async function getBins(): Promise<string[]> {
	return await globby([`${PATHS.bins}/*`, `!${PATHS.bins}/bunshell`]);
}


export async function ensureBin(script: {
	slug: string;
	path: string;
}) {
	const binPath = path.join(PATHS.bins, script.slug);
	console.log(`Ensuring bin: ${script.slug} -> ${binPath}`);
	if (argv.force === true && (await fs.pathExists(binPath)) === true) {
		console.log(`\nRemoving ${chalk.bold(script.slug)} bin file\n${chalk.gray(`rm ${binPath}`)}`)
		await $`rm ${binPath}`
	}
	if (false !== await fs.pathExists(binPath)) {
		return false;
	}

	// Create bin
	await fs.ensureDir(PATHS.bins);
	await fs.writeFile(binPath, template(script.path), "utf8");
	await $`chmod +x ${binPath}`;

	console.log(`Created new bin: ${script.slug} -> ${binPath}`);
	return binPath;
}

