import { PATHS } from "./config";

function template(scriptPath: string, exec: string): string {
	let output = "#!/bin/bash\n";
	output += `${exec} ${scriptPath} $@`;
	return output;
}


export async function getBins(): Promise<string[]> {
	return (await $`ls ${PATHS.bins}`.text()).split("\n");
}


export async function ensureBin(binName: string, targetPath: string, exec: string) {
	const binPath = path.join(PATHS.bins, binName);
	console.log(`Ensuring bin: ${binName} -> ${binPath}`);

	if (argv.force === true && (await Bun.file(binPath).exists()) === true) {
		console.log(`\nRemoving ${ansis.bold(binName)} bin file\n${ansis.gray(`rm ${binPath}`)}`)
		await $`rm ${binPath}`
	}

	if (false !== await Bun.file(binPath).exists()) {
		return false;
	}

	// Create bin
	await ensureDir(PATHS.bins);
	await Bun.write(binPath, template(targetPath, exec));
	await $`chmod +x ${binPath}`;

	console.log(`Created new bin: ${binName} -> ${binPath}`);
	return binPath;
}

