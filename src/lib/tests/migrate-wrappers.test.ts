import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { migrateBmAlias, migrateGeneratedBins, migrateLegacyWrappers } from '../migrate-wrappers';

type CommandResult = {
	stdout: string;
	stderr: string;
	exitCode: number;
};

const cleanupTargets: string[] = [];
const globalState = globalThis as Record<string, unknown>;
const originalHome = globalState.$HOME;

async function run(cmd: string[], cwd: string): Promise<CommandResult> {
	const child = Bun.spawn({
		cmd,
		cwd,
		stdout: 'pipe',
		stderr: 'pipe',
	});

	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(child.stdout).text(),
		new Response(child.stderr).text(),
		child.exited,
	]);

	return {
		stdout,
		stderr,
		exitCode,
	};
}

describe('wrapper migration', () => {
	afterEach(async () => {
		if (originalHome === undefined) {
			delete globalState.$HOME;
		} else {
			globalState.$HOME = originalHome;
		}

		while (cleanupTargets.length > 0) {
			const target = cleanupTargets.pop();
			if (!target) {
				continue;
			}

			await rm(target, { recursive: true, force: true });
		}
	});

	test('migrateBmAlias rewrites only legacy bm wrapper', async () => {
		const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-migrate-bm-'));
		cleanupTargets.push(tempRoot);
		const binDir = path.join(tempRoot, 'bin');
		await mkdir(binDir, { recursive: true });

		const bmPath = path.join(binDir, 'bm');
		await writeFile(bmPath, '#!/bin/bash\nbunmagic $@', 'utf8');

		const rewritten = await migrateBmAlias(binDir);
		expect(rewritten).toBe(true);
		expect(await Bun.file(bmPath).text()).toBe('#!/bin/bash\nexec bunmagic "$@"\n');

		const secondRun = await migrateBmAlias(binDir);
		expect(secondRun).toBe(false);
	});

	test('migrateGeneratedBins rewrites legacy bunmagic wrappers and skips custom scripts', async () => {
		const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-migrate-generated-'));
		cleanupTargets.push(tempRoot);
		const binDir = path.join(tempRoot, 'bin');
		await mkdir(binDir, { recursive: true });

		const execPath = path.join(binDir, 'example');
		await writeFile(execPath, '#!/bin/bash\nbunmagic-exec /tmp/probe script.ts probe $@\n', 'utf8');
		const nsPath = path.join(binDir, 'docs');
		await writeFile(
			nsPath,
			"#!/bin/bash\nbunmagic-exec-namespace /tmp/source's docs docs $@\n",
			'utf8',
		);
		const customPath = path.join(binDir, 'custom');
		await writeFile(customPath, '#!/bin/bash\necho "$@"\n', 'utf8');

		const rewrites = await migrateGeneratedBins(binDir);
		expect(rewrites).toBe(2);

		const execBody = await Bun.file(execPath).text();
		expect(execBody).toBe('#!/bin/bash\nexec bunmagic-exec \'/tmp/probe script.ts\' probe "$@"\n');

		const nsBody = await Bun.file(nsPath).text();
		expect(nsBody).toContain('exec bunmagic-exec-namespace');
		expect(nsBody).toContain("'\"'\"'");
		expect(nsBody).toContain('"$@"');

		const customBody = await Bun.file(customPath).text();
		expect(customBody).toBe('#!/bin/bash\necho "$@"\n');

		const execSyntax = await run(['bash', '-n', execPath], tempRoot);
		expect(execSyntax.exitCode).toBe(0);
		expect(execSyntax.stderr).toBe('');

		const nsSyntax = await run(['bash', '-n', nsPath], tempRoot);
		expect(nsSyntax.exitCode).toBe(0);
		expect(nsSyntax.stderr).toBe('');
	});

	test('migrateLegacyWrappers sets one-time marker and skips rerun once marked', async () => {
		const tempHome = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-migrate-startup-'));
		cleanupTargets.push(tempHome);
		globalState.$HOME = tempHome;

		const bunmagicDir = path.join(tempHome, '.bunmagic');
		const binDir = path.join(bunmagicDir, 'bin');
		await mkdir(binDir, { recursive: true });
		await writeFile(
			path.join(bunmagicDir, 'config.json'),
			JSON.stringify({ extension: 'ts' }),
			'utf8',
		);

		const bmPath = path.join(binDir, 'bm');
		await writeFile(bmPath, '#!/bin/bash\nbunmagic $@\n', 'utf8');

		await migrateLegacyWrappers();
		expect(await Bun.file(bmPath).text()).toBe('#!/bin/bash\nexec bunmagic "$@"\n');

		const config = JSON.parse(await Bun.file(path.join(bunmagicDir, 'config.json')).text()) as {
			migrations?: {
				wrapperArgvQuoted?: boolean;
			};
		};
		expect(config.migrations?.wrapperArgvQuoted).toBe(true);

		await writeFile(bmPath, '#!/bin/bash\nbunmagic $@\n', 'utf8');
		await migrateLegacyWrappers();
		expect(await Bun.file(bmPath).text()).toBe('#!/bin/bash\nbunmagic $@\n');
	});
});
