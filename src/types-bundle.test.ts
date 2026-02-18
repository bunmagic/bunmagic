import { expect, test } from 'bun:test';
import path from 'node:path';

test('bundled types exclude removed files JSON helpers', async () => {
	const bundlePath = path.resolve(import.meta.dir, '..', 'types', 'bunmagic.bundle.d.ts');
	const bundleTypes = await Bun.file(bundlePath).text();

	expect(bundleTypes).not.toContain('export declare const readJson');
	expect(bundleTypes).not.toContain('export declare function writeJson');
	expect(bundleTypes).not.toContain('export declare function outputJson');
	expect(bundleTypes).not.toContain('export declare function updateJson');
	expect(bundleTypes).not.toContain('export declare function writeJsonSafe');
});
