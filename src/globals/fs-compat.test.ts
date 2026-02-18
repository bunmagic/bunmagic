import { describe, expect, test } from 'bun:test';
import { mkdtemp, realpath, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import '../globals';
import { cd, cwd, glob } from '../index';

describe('global fs compatibility', () => {
	test('cd updates shell cwd without mutating process.cwd for absolute paths', async () => {
		const startShellCwd = await cwd();
		const startProcessCwd = process.cwd();
		const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bm-global-cd-'));

		try {
			cd(tempDir);
			expect(process.cwd()).toBe(startProcessCwd);
			expect(await realpath(await cwd())).toBe(await realpath(tempDir));
		} finally {
			cd(startShellCwd);
			process.chdir(startProcessCwd);
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	test('cd("~") keeps process.cwd unchanged', async () => {
		const startShellCwd = await cwd();
		const startProcessCwd = process.cwd();
		const homeDir = process.env.HOME ?? os.homedir();

		try {
			cd('~');
			expect(await realpath(await cwd())).toBe(await realpath(homeDir));
			expect(process.cwd()).toBe(startProcessCwd);
		} finally {
			cd(startShellCwd);
			process.chdir(startProcessCwd);
		}
	});

	test('global glob follows shell cwd even when process.cwd is unchanged', async () => {
		const startShellCwd = await cwd();
		const startProcessCwd = process.cwd();
		const tempDir = await mkdtemp(path.join(os.tmpdir(), 'bm-global-glob-'));
		const marker = `match-${Date.now()}-${Math.random().toString(16).slice(2)}.txt`;

		try {
			await Bun.write(path.join(tempDir, marker), 'ok\n');
			cd(tempDir);

			const matches = await glob(marker, { absolute: false });
			expect(matches).toEqual([marker]);
			expect(process.cwd()).toBe(startProcessCwd);
		} finally {
			cd(startShellCwd);
			process.chdir(startProcessCwd);
			await rm(tempDir, { recursive: true, force: true });
		}
	});
});
