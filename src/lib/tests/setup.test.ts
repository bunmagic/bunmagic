import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setupAlias } from '../setup';

const cleanupTargets: string[] = [];
const originalBunWhich = Bun.which;
const globalState = globalThis as Record<string, unknown>;
const originalAck = globalState.ack;
const originalShell = globalState.$;

describe('setupAlias', () => {
	afterEach(async () => {
		Bun.which = originalBunWhich;
		if (originalAck === undefined) {
			delete globalState.ack;
		} else {
			globalState.ack = originalAck;
		}
		if (originalShell === undefined) {
			delete globalState.$;
		} else {
			globalState.$ = originalShell;
		}

		while (cleanupTargets.length > 0) {
			const target = cleanupTargets.pop();
			if (!target) {
				continue;
			}

			await rm(target, { recursive: true, force: true });
		}
	});

	test('creates bm alias wrapper using exec + quoted argv forwarding', async () => {
		const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-setup-alias-'));
		cleanupTargets.push(tempRoot);

		const binaryPath = path.join(tempRoot, 'bin');
		await mkdir(binaryPath, { recursive: true });

		globalState.ack = () => true;
		globalState.$ = () => Promise.resolve(undefined);
		Bun.which = () => null;

		const created = await setupAlias(binaryPath);
		expect(created).toBe(true);

		const aliasPath = path.join(binaryPath, 'bm');
		const aliasBody = await Bun.file(aliasPath).text();
		expect(aliasBody).toBe('#!/bin/bash\nexec bunmagic "$@"\n');
	});
});
