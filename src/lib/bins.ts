import { PATHS } from "./config";

function template(scriptPath: string): string {
	let output = "#!/bin/bash\n";
	output += `bun run ${PATHS.source} ${scriptPath} $@`;
	return output;
}


export async function getBins(): Promise<string[]> {
	return (await $`ls ${PATHS.bins}`.text()).split("\n");
}


export async function ensureBin(script: {
	slug: string;
	path: string;
}) {
	const binPath = path.join(PATHS.bins, script.slug);
	console.log(`Ensuring bin: ${script.slug} -> ${binPath}`);
	if (argv.force === true && (await Bun.file(binPath).exists()) === true) {
		console.log(`\nRemoving ${ansis.bold(script.slug)} bin file\n${ansis.gray(`rm ${binPath}`)}`)
		await $`rm ${binPath}`
	}
	if (false !== await Bun.file(binPath).exists()) {
		return false;
	}

	// Create bin
	await ensureDir(PATHS.bins);
	await Bun.write(binPath, template(script.path));
	await $`chmod +x ${binPath}`;

	console.log(`Created new bin: ${script.slug} -> ${binPath}`);
	return binPath;
}

