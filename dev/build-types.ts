/**
 * Build the prebundled bunmagic types file using the existing repo types/.
 */
import 'bunmagic/globals';
import ansis from 'ansis';
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { generateDtsBundle } from 'dts-bundle-generator';

const REPO_ROOT = path.resolve(import.meta.dir, '..');
const TMP_PARENT = path.join(REPO_ROOT, 'dev', '.tmp');
const TMP_ROOT = path.join(TMP_PARENT, 'types-bundle');
const TMP_TYPES = path.join(TMP_ROOT, 'types');
const ENTRY_FILE = path.join(TMP_ROOT, 'bundle-entry.d.ts');
const OUTPUT_FILE = path.join(REPO_ROOT, 'types', 'bunmagic.bundle.d.ts');
const BUN_TYPES_ROOT = path.join(REPO_ROOT, 'node_modules', 'bun-types');

const readBunTypesBundle = async () => {
	const indexPath = path.join(BUN_TYPES_ROOT, 'index.d.ts');
	if ((await Bun.file(indexPath).exists()) === false) {
		return null;
	}

	const raw = await Bun.file(indexPath).text();
	const refTypeLines: string[] = [];
	const refPaths: string[] = [];
	const indexLines: string[] = [];

	for (const line of raw.split('\n')) {
		const trimmed = line.trim();
		const refPathMatch = trimmed.match(/^\/\/\/ <reference path="(.+)" \/>$/);
		if (refPathMatch) {
			refPaths.push(refPathMatch[1]);
			continue;
		}
		if (trimmed.startsWith('/// <reference types=')) {
			refTypeLines.push(line);
			continue;
		}
		indexLines.push(line);
	}

	const sections: string[] = [];
	sections.push('// bun-types');
	sections.push(...refTypeLines);
	if (indexLines.some(line => line.trim().length > 0)) {
		sections.push('', ...indexLines);
	}

	for (const refPath of refPaths) {
		const filePath = path.resolve(BUN_TYPES_ROOT, refPath);
		const file = Bun.file(filePath);
		if ((await file.exists()) === false) {
			throw new Exit(`Missing bun-types file: ${filePath}`);
		}
		const content = await file.text();
		sections.push('', content.trimEnd());
	}

	return `${sections.join('\n')}\n`;
};

const SOURCE_TYPES = path.join(REPO_ROOT, 'types');
if ((await Bun.file(path.join(SOURCE_TYPES, 'index.d.ts')).exists()) === false) {
	throw new Exit('Missing types/index.d.ts. Build types before bundling.');
}

await rm(TMP_ROOT, { recursive: true, force: true });
await mkdir(TMP_ROOT, { recursive: true });
await cp(SOURCE_TYPES, TMP_TYPES, { recursive: true });

const entryContents = [
	'import "./types/globals";',
	'export * from "./types/index";',
	'export * from "./types/run";',
	'export * from "./types/extras";',
	'export * from "./types/lib";',
	'',
].join('\n');

await Bun.write(ENTRY_FILE, entryContents);

const [bundle] = generateDtsBundle(
	[
		{
			filePath: ENTRY_FILE,
			output: {
				inlineDeclareGlobals: true,
				inlineDeclareExternals: true,
				noBanner: true,
			},
		},
	],
	{},
);

const bunTypesBundle = await readBunTypesBundle();
const finalBundle = bunTypesBundle ? `${bundle}\n\n${bunTypesBundle}` : `${bundle}\n`;
await Bun.write(OUTPUT_FILE, finalBundle);
console.log(ansis.green(`Wrote ${OUTPUT_FILE}`));

await rm(TMP_ROOT, { recursive: true, force: true });
