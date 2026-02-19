import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { getPathScripts } from '../scripts';

const cleanupTargets: string[] = [];

async function createFixture(files: string[]) {
	const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-script-loader-'));
	cleanupTargets.push(tempRoot);

	for (const file of files) {
		const filePath = path.join(tempRoot, file);
		await writeFile(filePath, 'export default async function main() {}\n');
	}

	return tempRoot;
}

describe('getPathScripts', () => {
	afterEach(async () => {
		while (cleanupTargets.length > 0) {
			const target = cleanupTargets.pop();
			if (!target) {
				continue;
			}

			await rm(target, { recursive: true, force: true });
		}
	});

	test('ignores .test and .spec files when discovering commands', async () => {
		(globalThis as Record<string, unknown>).flags = {};
		(globalThis as Record<string, unknown>).path = path;
		const sourceDir = await createFixture([
			'real.ts',
			'helper.js',
			'exec-args-forwarding.test.ts',
			'clean.spec.mjs',
			'_private.ts',
			'types.d.ts',
		]);

		const scripts = await getPathScripts(sourceDir, 'bunmagic');

		expect(Array.from(scripts.keys()).sort()).toEqual(['helper', 'real']);
		expect(scripts.has('exec-args-forwardingtest')).toBe(false);
		expect(scripts.has('cleanspec')).toBe(false);
	});
});
