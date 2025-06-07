/**
 * Import Bunmagic global types in the current directory.
 */
import { $, SAF, ack, ansis } from 'bunmagic';

const bunmagicPath = SAF.from('~/.bunmagic/bunmagic');

async function createGlobalsReference(ref: InstanceType<typeof SAF>) {
	const globalReferenceContent = `
	/// <reference types="${bunmagicPath.path}/types/index.d.ts" />
	/// <reference types="${bunmagicPath.path}/types/globals.d.ts" />
	`;
	console.log(ansis.green(`Creating global reference file: ${ref.path}`));
	await Bun.write(ref.path, globalReferenceContent);
}

async function linkGlobalsRefFile(ref: InstanceType<typeof SAF>) {
	const target = SAF.from('bunmagic.d.ts');
	// Check if the target file already exists
	if (await target.exists()) {
		console.log(ansis.dim(`Target file already exists: ${target.path}`));
		return;
	}

	await $`ln -s ${ref.path} ${target.path}`;
}

export default async function importBunmagicTypes() {
	const globalReference = SAF.from('~/.bunmagic/global-reference.ts');
	if ((await globalReference.exists()) === false) {
		await createGlobalsReference(globalReference);
	}

	console.log(ansis.green(`Linking global reference file: ${globalReference.path}`));
	await linkGlobalsRefFile(globalReference);

	if (ack('Add bunmagic.d.ts to .gitignore?')) {
		const gitignore = SAF.from('.gitignore');
		if ((await gitignore.exists()) === false) {
			await Bun.write(gitignore.path, 'bunmagic.d.ts');
		} else {
			const content = await Bun.file(gitignore.path).text();
			if (!content.includes('bunmagic.d.ts')) {
				const newContent = content.endsWith('\n')
					? `${content}bunmagic.d.ts\n`
					: `${content}\nbunmagic.d.ts\n`;
				await Bun.write(gitignore.path, newContent);
			}
		}
	}
}
