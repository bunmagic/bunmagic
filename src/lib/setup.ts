import ansis from 'ansis';

export async function setupAlias(binaryPath: string) {
	const bmAliasBinary = `${binaryPath}/bm`;
	const bmAliasQuestion = `\n- Do you want to setup ${ansis.bold('bm')} as a shortcut for ${ansis.bold('bunmagic')}?`;
	if (
		!(await Bun.file(bmAliasBinary).exists()) &&
		Bun.which('bm') === null &&
		ack(bmAliasQuestion)
	) {
		await Bun.write(`${bmAliasBinary}`, '#!/bin/bash\nbunmagic $@');
		await $`chmod +x ${bmAliasBinary}`;
		console.log(`\n- Created a new bin: ${ansis.bold('bm')} -> ${bmAliasBinary} \n`);
		return true;
	}

	return false;
}
