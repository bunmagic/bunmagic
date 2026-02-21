import { chmod, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { get as getConfig, PATHS, update as updateConfig } from './config';

const SAFE_SHELL_WORD = /^[A-Za-z0-9_@%+=:,./-]+$/;
const WRAPPER_MIGRATION_MARKER = 'wrapperArgvQuoted';
const FIXED_BM_WRAPPER = '#!/bin/bash\nexec bunmagic "$@"\n';

function quoteShellArg(value: string) {
	if (value.length === 0) {
		return "''";
	}

	if (SAFE_SHELL_WORD.test(value)) {
		return value;
	}

	return `'${value.replaceAll("'", `'\"'\"'`)}'`;
}

function normalizeScript(content: string) {
	return content.replaceAll('\r\n', '\n').trimEnd();
}

function migrateBmContent(content: string) {
	const normalized = normalizeScript(content);
	if (normalized === '#!/bin/bash\nbunmagic $@') {
		return FIXED_BM_WRAPPER;
	}

	if (normalized === '#!/bin/bash\nexec bunmagic $@') {
		return FIXED_BM_WRAPPER;
	}

	return null;
}

function migrateGeneratedWrapperContent(content: string) {
	const normalized = normalizeScript(content);
	const [shebang, body, ...rest] = normalized.split('\n');
	if (!body || rest.length > 0 || shebang !== '#!/bin/bash') {
		return null;
	}

	const line = body.trim();
	if (line.includes('"$@"') || !line.endsWith(' $@')) {
		return null;
	}

	let withoutForwarding = line.slice(0, -3);
	if (withoutForwarding.startsWith('exec ')) {
		withoutForwarding = withoutForwarding.slice(5);
	}

	let command: string | null = null;
	if (withoutForwarding.startsWith('bunmagic-exec ')) {
		command = 'bunmagic-exec';
	}
	if (withoutForwarding.startsWith('bunmagic-exec-namespace ')) {
		command = 'bunmagic-exec-namespace';
	}
	if (!command) {
		return null;
	}

	const payload = withoutForwarding.slice(command.length + 1);
	const splitIndex = payload.lastIndexOf(' ');
	if (splitIndex <= 0 || splitIndex >= payload.length - 1) {
		return null;
	}

	const firstArg = payload.slice(0, splitIndex);
	const secondArg = payload.slice(splitIndex + 1);
	return `#!/bin/bash\nexec ${command} ${quoteShellArg(firstArg)} ${quoteShellArg(secondArg)} "$@"\n`;
}

async function directoryExists(target: string) {
	try {
		await readdir(target);
		return true;
	} catch {
		return false;
	}
}

async function rewriteIfChanged(filePath: string, nextContent: string | null) {
	if (!nextContent) {
		return false;
	}

	await writeFile(filePath, nextContent, 'utf8');
	await chmod(filePath, 0o755);
	return true;
}

export async function migrateBmAlias(binDir: string) {
	const bmPath = path.join(binDir, 'bm');
	if (!(await Bun.file(bmPath).exists())) {
		return false;
	}

	const content = await readFile(bmPath, 'utf8');
	return rewriteIfChanged(bmPath, migrateBmContent(content));
}

export async function migrateGeneratedBins(binDir: string) {
	if (!(await directoryExists(binDir))) {
		return 0;
	}

	let rewrites = 0;
	const entries = await readdir(binDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isFile() || entry.name === 'bm') {
			continue;
		}

		const filePath = path.join(binDir, entry.name);
		const content = await readFile(filePath, 'utf8');
		const rewritten = await rewriteIfChanged(filePath, migrateGeneratedWrapperContent(content));
		if (rewritten) {
			rewrites += 1;
		}
	}

	return rewrites;
}

export async function migrateLegacyWrappers() {
	try {
		const migrations = await getConfig('migrations');
		if (migrations?.[WRAPPER_MIGRATION_MARKER]) {
			return;
		}

		if (!(await directoryExists(PATHS.bins))) {
			return;
		}

		await migrateBmAlias(PATHS.bins);
		await migrateGeneratedBins(PATHS.bins);
		await updateConfig('migrations', {
			...(migrations ?? {}),
			[WRAPPER_MIGRATION_MARKER]: true,
		});
	} catch {
		// Migration should never block command execution.
	}
}
