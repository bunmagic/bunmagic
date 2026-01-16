/**
 * Generate bunmagic.d.ts in the current directory.
 * @alias init
 * @alias add-types
 */

const PACKAGE_ROOT = path.resolve(import.meta.dir, '..', '..');
const TYPES_ROOT = path.resolve(PACKAGE_ROOT, 'types');
const NODE_MODULES = path.resolve(PACKAGE_ROOT, 'node_modules');
const OUTPUT_FILE = 'bunmagic.d.ts';

const normalizeRel = (rel: string) => rel.replaceAll('\\', '/');

const shouldInclude = (rel: string) => {
	const root = rel.split('/')[0];
	if (rel.endsWith('.test.d.ts')) {
		return false;
	}
	if (rel.includes('/test/') || rel.includes('/tests/')) {
		return false;
	}
	if (root === 'scripts' || root === 'bin') {
		return false;
	}
	if (rel.includes('/scripts/') || rel.includes('/bin/')) {
		return false;
	}

	return true;
};

const moduleNameFor = (rel: string) => {
	if (rel === 'index.d.ts') {
		return 'bunmagic';
	}
	if (rel === 'globals.d.ts') {
		return 'bunmagic/globals';
	}

	return `bunmagic/${rel.slice(0, -'.d.ts'.length)}`;
};

const rewriteSpecifiers = (content: string, rel: string, moduleMap: Map<string, string>) =>
	content.replace(/from\s+['"]([^'"]+)['"]/g, (match, spec) => {
		if (spec.startsWith('@lib/')) {
			return `from 'bunmagic/lib/${spec.slice('@lib/'.length)}'`;
		}

		if (!spec.startsWith('.')) {
			return match;
		}

		const base = path.posix.dirname(rel);
		const resolved = path.posix.normalize(path.posix.join(base, spec));
		const direct = moduleMap.get(resolved);
		if (direct) {
			return `from '${direct}'`;
		}

		const withExtension = moduleMap.get(`${resolved}.d.ts`);
		if (withExtension) {
			return `from '${withExtension}'`;
		}

		return match;
	});

const stripShebang = (content: string) => {
	if (content.startsWith('#!')) {
		const newline = content.indexOf('\n');
		return newline === -1 ? '' : content.slice(newline + 1);
	}

	return content;
};

const stripDeclareModifiers = (content: string) =>
	content.replace(/\bdeclare\s+(?!(module|global|namespace)\b)/g, '');

const stripTripleSlashReferences = (content: string) =>
	content
		.split('\n')
		.filter(line => {
			const trimmed = line.trimStart();
			if (trimmed.startsWith('/// <reference path=')) {
				return false;
			}
			if (trimmed.startsWith('/// <reference types=')) {
				return false;
			}
			return true;
		})
		.join('\n');

const stripTopLevelModuleMarkers = (content: string) =>
	content
		.split('\n')
		.filter(line => !(line.startsWith('import ') || line.startsWith('export ')))
		.join('\n');

const unwrapDeclareGlobal = (content: string) => {
	let output = '';
	let index = 0;
	const keyword = 'declare global';
	const length = content.length;

	const isBoundary = (char?: string) => !char || !/[A-Za-z0-9_$]/.test(char);

	const scanBlock = (start: number) => {
		let i = start;
		let depth = 1;
		let state: 'normal' | 'line' | 'block' | 'single' | 'double' | 'template' = 'normal';
		let inner = '';

		while (i < length) {
			const ch = content[i];
			const next = content[i + 1];

			if (state === 'normal') {
				if (ch === '/' && next === '/') {
					state = 'line';
					inner += ch;
					i += 1;
					continue;
				}
				if (ch === '/' && next === '*') {
					state = 'block';
					inner += ch;
					i += 1;
					continue;
				}
				if (ch === "'") {
					state = 'single';
					inner += ch;
					i += 1;
					continue;
				}
				if (ch === '"') {
					state = 'double';
					inner += ch;
					i += 1;
					continue;
				}
				if (ch === '`') {
					state = 'template';
					inner += ch;
					i += 1;
					continue;
				}
				if (ch === '{') {
					depth += 1;
				} else if (ch === '}') {
					depth -= 1;
					if (depth === 0) {
						return { inner, end: i + 1 };
					}
				}
				inner += ch;
				i += 1;
				continue;
			}

			if (state === 'line') {
				inner += ch;
				if (ch === '\n') {
					state = 'normal';
				}
				i += 1;
				continue;
			}

			if (state === 'block') {
				inner += ch;
				if (ch === '*' && next === '/') {
					inner += next;
					i += 2;
					state = 'normal';
					continue;
				}
				i += 1;
				continue;
			}

			if (state === 'single') {
				inner += ch;
				if (ch === '\\') {
					inner += next ?? '';
					i += 2;
					continue;
				}
				if (ch === "'") {
					state = 'normal';
				}
				i += 1;
				continue;
			}

			if (state === 'double') {
				inner += ch;
				if (ch === '\\') {
					inner += next ?? '';
					i += 2;
					continue;
				}
				if (ch === '"') {
					state = 'normal';
				}
				i += 1;
				continue;
			}

			if (state === 'template') {
				inner += ch;
				if (ch === '\\') {
					inner += next ?? '';
					i += 2;
					continue;
				}
				if (ch === '`') {
					state = 'normal';
				}
				i += 1;
			}
		}

		return { inner, end: length };
	};

	while (index < length) {
		const found = content.indexOf(keyword, index);
		if (found === -1) {
			output += content.slice(index);
			break;
		}

		const before = content[found - 1];
		const after = content[found + keyword.length];
		if (!isBoundary(before) || !isBoundary(after)) {
			output += content.slice(index, found + keyword.length);
			index = found + keyword.length;
			continue;
		}

		output += content.slice(index, found);
		index = found + keyword.length;
		while (index < length && /\s/.test(content[index])) {
			index += 1;
		}
		if (content[index] !== '{') {
			output += keyword;
			continue;
		}
		index += 1;
		const { inner, end } = scanBlock(index);
		output += inner;
		index = end;
	}

	return output;
};

const indent = (text: string, spaces = 2) => {
	const pad = ' '.repeat(spaces);
	return text
		.trimEnd()
		.split('\n')
		.map(line => (line.length ? `${pad}${line}` : line))
		.join('\n');
};

const collectExternalModules = (content: string, set: Set<string>) => {
	for (const [, spec] of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
		set.add(spec);
	}
	for (const [, spec] of content.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
		set.add(spec);
	}
};

const readAllDts = async (root: string) => {
	const glob = new Bun.Glob('**/*.d.ts');
	const files: string[] = [];
	for await (const file of glob.scan({ cwd: root, onlyFiles: true })) {
		files.push(normalizeRel(file));
	}
	files.sort((a, b) => a.localeCompare(b));
	return files;
};

const resolvePackageRoot = async (name: string) => {
	const directRoot = path.resolve(NODE_MODULES, name);
	if (await Bun.file(path.join(directRoot, 'package.json')).exists()) {
		return { root: directRoot, isTypes: name.startsWith('@types/') };
	}

	const typesRoot = path.resolve(NODE_MODULES, '@types', name);
	if (await Bun.file(path.join(typesRoot, 'package.json')).exists()) {
		return { root: typesRoot, isTypes: true };
	}

	return { root: directRoot, isTypes: name.startsWith('@types/') };
};

const loadNodeTypes = async () => {
	const nodeRoot = path.resolve(NODE_MODULES, '@types', 'node');
	const files = await readAllDts(nodeRoot);
	const sections: string[] = [];
	const indexPath = path.join(nodeRoot, 'index.d.ts');
	if (await Bun.file(indexPath).exists()) {
		const indexRaw = await Bun.file(indexPath).text();
		const libs = indexRaw
			.split('\n')
			.filter(line => line.trimStart().startsWith('/// <reference lib='));
		if (libs.length > 0) {
			sections.push(libs.join('\n'));
		}
	}

	for (const rel of files) {
		const filePath = path.join(nodeRoot, rel);
		const raw = await Bun.file(filePath).text();
		const cleaned = unwrapDeclareGlobal(
			stripTopLevelModuleMarkers(stripTripleSlashReferences(raw)),
		);
		if (cleaned.trim().length === 0) {
			continue;
		}
		sections.push(cleaned.trimEnd());
	}

	return sections;
};

const loadBunTypes = async () => {
	const bunRoot = path.resolve(NODE_MODULES, 'bun-types');
	const files = await readAllDts(bunRoot);
	const sections: string[] = [];
	for (const rel of files) {
		const filePath = path.join(bunRoot, rel);
		const raw = await Bun.file(filePath).text();
		if (rel === 'bun.ns.d.ts') {
			const cleaned = stripTripleSlashReferences(raw);
			if (cleaned.trim().length === 0) {
				continue;
			}
			sections.push(`declare module "bunmagic/__globals" {\n${indent(cleaned)}\n}`);
			continue;
		}

		const cleaned = unwrapDeclareGlobal(
			stripTopLevelModuleMarkers(stripTripleSlashReferences(raw)),
		);
		if (cleaned.trim().length === 0) {
			continue;
		}
		sections.push(cleaned.trimEnd());
	}
	return sections;
};

const loadPackageTypes = async (name: string) => {
	const resolved = await resolvePackageRoot(name);
	const pkgRoot = resolved.root;
	const isTypesPackage = resolved.isTypes;
	const pkgJsonPath = path.join(pkgRoot, 'package.json');
	if ((await Bun.file(pkgJsonPath).exists()) === false) {
		throw new Exit(`Missing package for types: ${name}`);
	}
	const pkgJson = await Bun.file(pkgJsonPath).json<{ types?: string; typings?: string }>();
	const entry = pkgJson.types ?? pkgJson.typings ?? 'index.d.ts';
	const entryPath = path.resolve(pkgRoot, entry);
	if ((await Bun.file(entryPath).exists()) === false) {
		throw new Exit(`Types entry not found for ${name}: ${entryPath}`);
	}

	const allFiles = await readAllDts(pkgRoot);
	const moduleMap = new Map<string, string>();
	for (const rel of allFiles) {
		if (rel.endsWith('.d.ts')) {
			const relName = rel.startsWith('./') ? rel.slice(2) : rel;
			const entryName = entry.startsWith('./') ? entry.slice(2) : entry;
			const modName =
				relName === entryName ? name : `${name}/${relName.slice(0, -'.d.ts'.length)}`;
			moduleMap.set(rel, modName);
		}
	}

	const sections: string[] = [];
	for (const rel of allFiles) {
		const filePath = path.resolve(pkgRoot, rel);
		const raw = await Bun.file(filePath).text();
		const cleaned = stripTripleSlashReferences(raw);
		if (cleaned.trim().length === 0) {
			continue;
		}

		if (isTypesPackage && rel.endsWith('global.d.ts')) {
			sections.push(cleaned.trimEnd());
			continue;
		}

		const rewritten = rewriteSpecifiers(cleaned, rel, moduleMap);
		const modName = moduleMap.get(rel) ?? `${name}/${rel.slice(0, -'.d.ts'.length)}`;
		const stripped = stripDeclareModifiers(rewritten);
		sections.push(`declare module "${modName}" {\n${indent(stripped)}\n}`);
	}

	return sections;
};

export default async function generateTypesFile() {
	const root = SAF.from(TYPES_ROOT);
	if ((await root.isDirectory()) === false) {
		throw new Exit(`Types directory not found: ${TYPES_ROOT}`);
	}

	const glob = new Bun.Glob('**/*.d.ts');
	const files: string[] = [];
	for await (const file of glob.scan({ cwd: root.path, onlyFiles: true })) {
		const rel = normalizeRel(file);
		if (shouldInclude(rel)) {
			files.push(rel);
		}
	}

	if (files.length === 0) {
		throw new Exit(`No .d.ts files found under: ${TYPES_ROOT}`);
	}

	files.sort((a, b) => {
		if (a === 'index.d.ts') return -1;
		if (b === 'index.d.ts') return 1;
		if (a === 'globals.d.ts') return -1;
		if (b === 'globals.d.ts') return 1;
		return a.localeCompare(b);
	});

	const moduleMap = new Map<string, string>();
	for (const rel of files) {
		moduleMap.set(rel, moduleNameFor(rel));
	}

	const sections: string[] = [];
	const externalModules = new Set<string>();

	for (const rel of files) {
		const filePath = path.resolve(root.path, rel);
		const raw = await Bun.file(filePath).text();
		collectExternalModules(raw, externalModules);
	}

	const bunRoot = path.resolve(NODE_MODULES, 'bun-types');
	if (await Bun.file(bunRoot).exists()) {
		const bunFiles = await readAllDts(bunRoot);
		for (const rel of bunFiles) {
			const raw = await Bun.file(path.join(bunRoot, rel)).text();
			collectExternalModules(raw, externalModules);
		}
	}

	const filteredExternal = new Set<string>();
	for (const spec of externalModules) {
		if (!spec || spec.startsWith('.') || spec.startsWith('@lib/')) {
			continue;
		}
		if (spec.startsWith('bunmagic')) {
			continue;
		}
		filteredExternal.add(spec);
	}

	const needsNodeTypes =
		filteredExternal.has('bun') || [...filteredExternal].some(name => name.startsWith('node:'));

	if (needsNodeTypes) {
		sections.push(...(await loadNodeTypes()));
	}

	if (filteredExternal.has('bun')) {
		sections.push(...(await loadBunTypes()));
	}

	for (const name of filteredExternal) {
		if (name === 'bun') {
			continue;
		}
		if (name.startsWith('node:')) {
			continue;
		}
		sections.push(...(await loadPackageTypes(name)));
	}

	for (const rel of files) {
		const filePath = path.resolve(root.path, rel);
		const moduleName = moduleMap.get(rel);
		if (!moduleName) {
			continue;
		}

		const raw = await Bun.file(filePath).text();
		const rewritten = rewriteSpecifiers(stripShebang(raw), rel, moduleMap);
		const cleaned = stripDeclareModifiers(rewritten);
		sections.push(`declare module "${moduleName}" {\n${indent(cleaned)}\n}`);
	}

	const header = `// Generated by bunmagic types. Regenerate with: bunmagic types\n\n`;
	await Bun.write(OUTPUT_FILE, `${header}${sections.join('\n\n')}\n`);
	console.log(ansis.green(`Wrote ${OUTPUT_FILE}`));

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
