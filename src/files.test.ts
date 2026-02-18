import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { $ } from 'bun';
import * as files from './files';

let testDir = '';

function fixture(...parts: string[]) {
	return path.join(testDir, ...parts);
}

describe('files API', () => {
	beforeEach(async () => {
		testDir = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-files-test-'));
	});

	afterEach(async () => {
		await rm(testDir, { recursive: true, force: true });
	});

	test('resolve expands tilde paths', () => {
		const target = files.resolve('~/bunmagic-test');
		expect(target).toBe(path.resolve(os.homedir(), 'bunmagic-test'));
	});

	test('stem returns basename without the last extension', () => {
		expect(files.stem('/tmp/archive.tar.gz')).toBe('archive.tar');
		expect(files.stem('/tmp/.env')).toBe('.env');
		expect(files.stem('note.txt')).toBe('note');
	});

	test('helper behavior: ensure/read/write/edit and emptyDir', async () => {
		const dir = fixture('helpers', 'nested');
		const file = fixture('helpers', 'nested', 'note.txt');

		const ensuredDir = await files.ensureDir(dir);
		expect(ensuredDir).toBe(path.resolve(dir));
		expect(await files.isDir(dir)).toBe(true);

		const ensuredFile = await files.ensureFile(file);
		expect(ensuredFile).toBe(path.resolve(file));
		expect(await files.pathExists(file)).toBe(true);
		expect(await files.isFile(file)).toBe(true);

		const firstWriteBytes = await files.writeFile(file, 'hello');
		expect(firstWriteBytes).toBe(5);
		expect(await files.readFile(file)).toBe('hello');

		await files.editFile(file, content => content.toUpperCase());
		expect(await files.readFile(file)).toBe('HELLO');
		expect(new TextDecoder().decode(await files.readBytes(file))).toBe('HELLO');

		await files.writeFile(fixture('helpers', 'nested', 'another.txt'), 'x');
		const emptiedDir = await files.emptyDir(dir);
		expect(emptiedDir).toBe(path.resolve(dir));
		expect(await files.glob('*', { cwd: dir, absolute: false })).toEqual([]);
	});

	test('glob defaults follow shell cwd and not process.cwd', async () => {
		// eslint-disable-next-line unicorn/no-await-expression-member
		const previousShellCwd = (await $`pwd`.text()).trim();
		const previousProcessCwd = process.cwd();
		const globDir = fixture('glob-defaults');
		const matchPath = path.join(globDir, 'match.ts');
		const nonMatchPath = path.join(globDir, 'ignore.js');

		await files.ensureDir(globDir);
		await files.writeFile(matchPath, 'export const ok = true;\n');
		await files.writeFile(nonMatchPath, 'console.log("ignore");\n');

		$.cwd(globDir);
		try {
			const matches = await files.glob('*.ts', { absolute: false });
			expect(matches).toEqual(['match.ts']);
			expect(process.cwd()).toBe(previousProcessCwd);
		} finally {
			$.cwd(previousShellCwd);
			process.chdir(previousProcessCwd);
		}
	});

	test('ensureUniquePath applies suffix rules for extension, no extension, and dotfiles', async () => {
		const json = fixture('report.json');
		await files.writeFile(json, '{}');
		await files.writeFile(fixture('report_1.json'), '{}');

		const jsonSafe = await files.ensureUniquePath(json);
		expect(path.basename(jsonSafe)).toBe('report_2.json');

		const noExt = fixture('archive');
		await files.writeFile(noExt, 'a');
		const noExtSafe = await files.ensureUniquePath(noExt);
		expect(path.basename(noExtSafe)).toBe('archive_1');

		const dotfile = fixture('.env');
		await files.writeFile(dotfile, 'SECRET=1');
		const dotfileSafe = await files.ensureUniquePath(dotfile);
		expect(path.basename(dotfileSafe)).toBe('.env_1');
	});

	test('ensureUniquePath supports custom start/separator and maxAttempts failures', async () => {
		const custom = fixture('custom.txt');
		await files.writeFile(custom, 'value');
		const customSafe = await files.ensureUniquePath(custom, { separator: '-', start: 3 });
		expect(path.basename(customSafe)).toBe('custom-3.txt');

		const limited = fixture('limited.txt');
		await files.writeFile(limited, 'a');
		await files.writeFile(fixture('limited_1.txt'), 'b');
		await files.writeFile(fixture('limited_2.txt'), 'c');

		await expect(files.ensureUniquePath(limited, { maxAttempts: 2 })).rejects.toThrow(
			'Failed to find a safe path',
		);
	});

	test('copy and move parity: collisions throw by default and overwrite works', async () => {
		const source = fixture('source.txt');
		const destination = fixture('destination.txt');
		await files.writeFile(source, 'source');
		await files.writeFile(destination, 'destination');

		await expect(files.copy(source, destination)).rejects.toMatchObject({ code: 'EEXIST' });
		await expect(files.move(source, destination)).rejects.toMatchObject({ code: 'EEXIST' });

		const copied = await files.copy(source, destination, { overwrite: true });
		expect(copied).toBe(path.resolve(destination));
		expect(await files.readFile(destination)).toBe('source');
		expect(await files.pathExists(source)).toBe(true);

		await files.writeFile(source, 'moved');
		const moved = await files.move(source, destination, { overwrite: true });
		expect(moved).toBe(path.resolve(destination));
		expect(await files.readFile(destination)).toBe('moved');
		expect(await files.pathExists(source)).toBe(false);
	});

	test('move with overwrite no-ops when source and destination are identical', async () => {
		const target = fixture('same-path.txt');
		await files.writeFile(target, 'same-path-data');

		const moved = await files.move(target, target, { overwrite: true });
		expect(moved).toBe(path.resolve(target));
		expect(await files.readFile(target)).toBe('same-path-data');
	});

	test('move with overwrite rejects overlapping source and destination paths', async () => {
		const parent = fixture('overlap-parent');
		const source = path.join(parent, 'source');
		const sourceFile = path.join(source, 'file.txt');
		await files.ensureDir(source);
		await files.writeFile(sourceFile, 'overlap-data');

		await expect(files.move(source, parent, { overwrite: true })).rejects.toThrow(
			'Cannot move overlapping paths',
		);
		expect(await files.pathExists(source)).toBe(true);
		expect(await files.readFile(sourceFile)).toBe('overlap-data');
	});

	test('copy and move support errorOnExist=false collision skip', async () => {
		const source = fixture('skip-source.txt');
		const destination = fixture('skip-destination.txt');
		await files.writeFile(source, 'source');
		await files.writeFile(destination, 'destination');

		const copied = await files.copy(source, destination, {
			overwrite: false,
			errorOnExist: false,
		});
		expect(copied).toBe(path.resolve(destination));
		expect(await files.readFile(destination)).toBe('destination');
		expect(await files.readFile(source)).toBe('source');

		const moved = await files.move(source, destination, {
			overwrite: false,
			errorOnExist: false,
		});
		expect(moved).toBe(path.resolve(destination));
		expect(await files.readFile(destination)).toBe('destination');
		expect(await files.pathExists(source)).toBe(true);
	});

	test('nested copy/move work for deep paths without extra helper options', async () => {
		const source = fixture('nested-source.txt');
		await files.writeFile(source, 'nested');

		const copyDestination = fixture('copy', 'deep', 'copied.txt');
		await files.copy(source, copyDestination);
		expect(await files.readFile(copyDestination)).toBe('nested');

		const moveSource = fixture('nested-move-source.txt');
		await files.writeFile(moveSource, 'move-nested');
		const moveDestination = fixture('move', 'deep', 'moved.txt');
		await files.ensureDir(path.dirname(moveDestination));
		await files.move(moveSource, moveDestination);
		expect(await files.readFile(moveDestination)).toBe('move-nested');
		expect(await files.pathExists(moveSource)).toBe(false);
	});

	test('safe write/copy/move helpers suffix on collision without overwriting', async () => {
		const target = fixture('safe.txt');
		await files.writeFile(target, 'old');
		const writeResult = await files.writeFileSafe(target, 'new');
		expect(path.basename(writeResult)).toBe('safe_1.txt');
		expect(await files.readFile(target)).toBe('old');
		expect(await files.readFile(writeResult)).toBe('new');

		const copySource = fixture('copy-safe-source.txt');
		await files.writeFile(copySource, 'copy');
		const copyResult = await files.copySafe(copySource, target);
		expect(path.basename(copyResult)).toBe('safe_2.txt');
		expect(await files.readFile(copyResult)).toBe('copy');

		const moveSource = fixture('move-safe-source.txt');
		await files.writeFile(moveSource, 'move');
		const moveResult = await files.moveSafe(moveSource, target);
		expect(path.basename(moveResult)).toBe('safe_3.txt');
		expect(await files.readFile(moveResult)).toBe('move');
		expect(await files.pathExists(moveSource)).toBe(false);
	});

	test('write flags: wx rejects existing targets for standard and atomic writes', async () => {
		const target = fixture('write.txt');
		await files.writeFile(target, 'first');

		await expect(files.writeFile(target, 'second', { flag: 'wx' })).rejects.toThrow();
		await expect(
			files.writeFile(target, 'third', { flag: 'wx', atomic: true }),
		).rejects.toMatchObject({ code: 'EEXIST' });
		expect(await files.readFile(target)).toBe('first');

		const fresh = fixture('fresh.txt');
		await files.writeFile(fresh, 'fresh', { flag: 'wx' });
		expect(await files.readFile(fresh)).toBe('fresh');
	});

	test('writeFile with flag:wx supports top-level SharedArrayBuffer bytes', async () => {
		const target = fixture('shared-array-buffer.bin');
		const buffer = new SharedArrayBuffer(4);
		new Uint8Array(buffer).set([1, 2, 3, 4]);

		await files.writeFile(target, buffer, { flag: 'wx' });
		const bytes = await files.readBytes(target);
		expect([...bytes]).toEqual([1, 2, 3, 4]);
	});

	test('writeFileSafe preserves bytes for SharedArrayBuffer data', async () => {
		const target = fixture('safe-shared.bin');
		await files.writeFile(target, new Uint8Array([9]));
		const buffer = new SharedArrayBuffer(3);
		new Uint8Array(buffer).set([6, 7, 8]);

		const result = await files.writeFileSafe(target, buffer);
		expect(path.basename(result)).toBe('safe-shared_1.bin');
		const bytes = await files.readBytes(result);
		expect([...bytes]).toEqual([6, 7, 8]);
	});

	test('writeFile with flag:wx throws TypeError for unsupported object input', async () => {
		const target = fixture('unsupported.bin');
		const unsupported = { unexpected: true } as unknown as files.BlobInput;

		await expect(files.writeFile(target, unsupported, { flag: 'wx' })).rejects.toBeInstanceOf(
			TypeError,
		);
	});

	test('outputFile ensures parent directories before writing', async () => {
		const outputTarget = fixture('output', 'deep', 'file.txt');
		const bytes = await files.outputFile(outputTarget, 'hello');
		expect(bytes).toBe(5);
		expect(await files.readFile(outputTarget)).toBe('hello');
	});

	test('files helpers reject non-string paths at runtime', async () => {
		const fakeUrl = new URL(`file://${fixture('url-path.txt')}`) as unknown as string;
		await expect(files.pathExists(fakeUrl)).rejects.toThrow();
	});

	test('files helpers reject empty and whitespace-only paths', async () => {
		await expect(files.remove('')).rejects.toThrow('Path must be a non-empty string');
		await expect(files.remove('   ')).rejects.toThrow('Path must be a non-empty string');
		await expect(files.emptyDir('')).rejects.toThrow('Path must be a non-empty string');
		await expect(files.pathExists('')).rejects.toThrow('Path must be a non-empty string');
		await expect(() => files.resolve('')).toThrow('Path must be a non-empty string');
	});
});
