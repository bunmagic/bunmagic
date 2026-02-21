import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Script } from '@lib/script';
import { ensureScriptBin } from './reload';

type CommandResult = {
	stdout: string;
	stderr: string;
	exitCode: number;
};

const cleanupTargets: string[] = [];
const globalState = globalThis as Record<string, unknown>;
const originalFlags = globalState.flags;
const originalEnsureDirectory = globalState.ensureDirectory;
const originalShell = globalState.$;
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

describe('reload wrapper generation', () => {
	afterEach(async () => {
		if (originalFlags === undefined) {
			delete globalState.flags;
		} else {
			globalState.flags = originalFlags;
		}
		if (originalEnsureDirectory === undefined) {
			delete globalState.ensureDirectory;
		} else {
			globalState.ensureDirectory = originalEnsureDirectory;
		}
		if (originalShell === undefined) {
			delete globalState.$;
		} else {
			globalState.$ = originalShell;
		}
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

	test('ensureScriptBin emits quoted wrapper with exec + "$@" forwarding', async () => {
		const tempHome = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-reload-bin-'));
		cleanupTargets.push(tempHome);

		globalState.$HOME = tempHome;
		globalState.flags = { force: false };
		globalState.ensureDirectory = (target: string) => mkdir(target, { recursive: true });
		globalState.$ = () => Promise.resolve(undefined);

		const sourceDir = path.join(tempHome, 'source');
		const scriptPath = path.join(sourceDir, 'probe script.ts');
		await mkdir(sourceDir, { recursive: true });
		await writeFile(scriptPath, 'export default async function main() {}\n');

		const script = new Script({
			source: scriptPath,
			slug: 'probe',
		});

		await ensureScriptBin(script);
		const binBody = await Bun.file(script.bin).text();
		expect(binBody).toBe(`#!/bin/bash\nexec bunmagic-exec '${scriptPath}' probe "$@"\n`);
	});

	test('ensureScriptBin escapes single quotes in script path with valid shell syntax', async () => {
		const tempHome = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-reload-bin-quote-'));
		cleanupTargets.push(tempHome);

		globalState.$HOME = tempHome;
		globalState.flags = { force: false };
		globalState.ensureDirectory = (target: string) => mkdir(target, { recursive: true });
		globalState.$ = () => Promise.resolve(undefined);

		const sourceDir = path.join(tempHome, "source's");
		const scriptPath = path.join(sourceDir, 'probe.ts');
		await mkdir(sourceDir, { recursive: true });
		await writeFile(scriptPath, 'export default async function main() {}\n');

		const script = new Script({
			source: scriptPath,
			slug: 'probe',
		});

		await ensureScriptBin(script);
		const binBody = await Bun.file(script.bin).text();
		expect(binBody).toContain(`"$@"`);
		expect(binBody).toContain(`'"'"'`);

		const syntax = await run(['bash', '-n', script.bin], tempHome);
		expect(syntax.exitCode).toBe(0);
		expect(syntax.stderr).toBe('');
	});
});
