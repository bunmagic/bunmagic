import path from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import {
	expect,
	test,
	describe,
	beforeEach,
	afterEach,
} from 'bun:test';
import { SAF } from './saf';

describe('SAF', () => {
	const testDirectory = path.join(process.cwd(), 'test-tmp');

	beforeEach(async () => {
		await mkdir(testDirectory, { recursive: true });
	});

	afterEach(async () => {
		await rm(testDirectory, { recursive: true, force: true });
	});

	test('constructor handles tilde paths', () => {
		const saf = new SAF('~/test.txt');
		expect(saf.path).toContain('/test.txt');
		expect(saf.path).not.toContain('~');
	});

	test('getSafePath returns original path if no file exists', async () => {
		const testPath = path.join(testDirectory, 'test.txt');
		const saf = new SAF(testPath);
		const safePath = await saf.getSafePath(testPath);
		expect(safePath).toBe(testPath);
	});

	test('getSafePath appends number for existing files', async () => {
		const testPath = path.join(testDirectory, 'test.txt');
		await writeFile(testPath, 'original');

		const saf = new SAF(testPath);
		const safePath = await saf.getSafePath(testPath);
		expect(safePath).toBe(path.join(testDirectory, 'test_1.txt'));
	});

	test('rename renames file to new path', async () => {
		const originalPath = path.join(testDirectory, 'original.txt');
		const newPath = path.join(testDirectory, 'new.txt');
		await writeFile(originalPath, 'test content');

		const saf = new SAF(originalPath);
		const resultPath = await saf.rename(newPath);

		expect(resultPath).toBe(newPath);
		const exists = await Bun.file(newPath).exists();
		expect(exists).toBe(true);
	});

	test('rename handles existing target files', async () => {
		const originalPath = path.join(testDirectory, 'original.txt');
		const newPath = path.join(testDirectory, 'new.txt');

		await writeFile(originalPath, 'original content');
		await writeFile(newPath, 'existing content');

		const saf = new SAF(originalPath);
		const resultPath = await saf.rename(newPath);

		expect(resultPath).toBe(path.join(testDirectory, 'new_1.txt'));
		const exists = await Bun.file(resultPath).exists();
		expect(exists).toBe(true);
	});
});
