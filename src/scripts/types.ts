/**
 * Copy prebuilt bunmagic.d.ts into the current directory.
 * @autohelp
 * @alias init
 * @alias add-types
 */

const PACKAGE_ROOT = path.resolve(import.meta.dir, '..', '..');
const BUNDLE_FILE = path.resolve(PACKAGE_ROOT, 'types', 'bunmagic.bundle.d.ts');
const OUTPUT_FILE = 'bunmagic.d.ts';

export default async function copyTypesBundle() {
	const outputExists = await Bun.file(OUTPUT_FILE).exists();
	const bundle = Bun.file(BUNDLE_FILE);
	if ((await bundle.exists()) === false) {
		throw new Exit(
			`Missing ${BUNDLE_FILE}. Run \`bun run dev/build-types.ts\` in the bunmagic repo.`,
		);
	}

	await Bun.write(OUTPUT_FILE, bundle);
	console.log(ansis.green(`Wrote ${OUTPUT_FILE}`));

	if (!outputExists && ack('Add bunmagic.d.ts to .gitignore?')) {
		const gitignore = SAF.from('.gitignore');
		if ((await gitignore.exists()) === false) {
			await Bun.write(gitignore.path, 'bunmagic.d.ts\n');
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
