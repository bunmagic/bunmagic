/* eslint-disable import/no-unassigned-import */
import { mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import 'bunmagic/globals';
import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { SAF } from './saf';

const TEST_DIR = '/tmp/bunmagic-saf-test';
const PROJECT_ROOT = path.resolve(import.meta.dir, '..', '..');
const SAF_DEPRECATION_MESSAGE =
	'[bunmagic] SAF is deprecated and will be removed in v1.5.0. Use files.* helpers. See docs: https://bunmagic.com/migrations/saf-to-files';

function getTestFile(file: string) {
	return SAF.from(TEST_DIR, file);
}

function countOccurrences(content: string, needle: string) {
	return content.split(needle).length - 1;
}

async function runSafDeprecationProbe(silenceDeprecations = false) {
	const env = { ...process.env };
	if (silenceDeprecations) {
		env.BUNMAGIC_SILENCE_DEPRECATIONS = '1';
	} else {
		delete env.BUNMAGIC_SILENCE_DEPRECATIONS;
	}

	const processResult = Bun.spawn({
		cmd: [
			'bun',
			'--eval',
			`import { SAF } from './src/extras/saf.ts';
new SAF('constructor.txt');
SAF.from('static-from.txt');
await SAF.prepare('static-prepare.txt');`,
		],
		cwd: PROJECT_ROOT,
		env,
		stdout: 'pipe',
		stderr: 'pipe',
	});

	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(processResult.stdout).text(),
		new Response(processResult.stderr).text(),
		processResult.exited,
	]);

	return {
		stdout,
		stderr,
		exitCode,
	};
}

describe('SAF', () => {
	beforeEach(async () => {
		await mkdir(TEST_DIR, { recursive: true });
		cd(TEST_DIR);
	});

	afterEach(async () => {
		cd('~');
		await rm(TEST_DIR, { recursive: true, force: true });
	});

	describe('deprecation warnings', () => {
		test('emits deprecation warning once per process', async () => {
			const result = await runSafDeprecationProbe();
			expect(result.exitCode).toBe(0);
			expect(result.stdout).toBe('');
			expect(countOccurrences(result.stderr, SAF_DEPRECATION_MESSAGE)).toBe(1);
		});

		test('suppresses deprecation warning when BUNMAGIC_SILENCE_DEPRECATIONS=1', async () => {
			const result = await runSafDeprecationProbe(true);
			expect(result.exitCode).toBe(0);
			expect(result.stderr).not.toContain(SAF_DEPRECATION_MESSAGE);
		});
	});

	test('can create a SAF instance from directory and target', () => {
		const saf = getTestFile('test.txt');
		expect(saf.path).toBe(path.resolve(TEST_DIR, 'test.txt'));
	});

	test('can create a SAF instance from target only', () => {
		const saf = getTestFile('test2.txt');
		expect(saf.path).toBe(path.resolve(TEST_DIR, 'test2.txt'));
	});

	test('handles tilde expansion in target', () => {
		const saf = SAF.from('~/test3.txt');
		expect(saf.path).toBe(`${os.homedir()}/test3.txt`);
	});

	test('write and read content', async () => {
		const saf = getTestFile('write_test.txt');
		const content = 'Hello, SAF!';
		await saf.write(content);
		const readContent = await saf.file.text();
		expect(readContent).toBe(content);
	});

	test('json method without data should read existing JSON', async () => {
		const saf = getTestFile('data.json');
		const data = { key: 'value' };
		await saf.write(JSON.stringify(data, null, 2));

		const readData = await saf.json();
		expect(readData).toEqual(data);
	});

	test('json method with data should write JSON', async () => {
		const saf = getTestFile('write_json.json');
		const data = { foo: 'bar' };
		const returnedData = await saf.json(data);
		expect(returnedData).toEqual(data);

		const fileContent = await saf.file.text();
		expect(JSON.parse(fileContent)).toEqual(data);
	});

	test('update method changes the handle when safeMode is enabled', async () => {
		const saf = getTestFile('update_test.txt');
		await saf.write('Initial Content');

		saf.safeMode = true;
		await saf.update();

		expect(saf.path).toBe(path.resolve(TEST_DIR, 'update_test.txt'));
	});

	test('update method handles deleted files', async () => {
		const saf = SAF.from('deleted_file.txt');
		await saf.delete();
		const result = await saf.update();
		expect(result).toBe(saf);
	});

	test('delete method removes the file and clears handle', async () => {
		const saf = getTestFile('delete_test.txt');
		await saf.write('To be deleted');
		await saf.delete('clear_handle');

		const exists = await saf.exists();
		expect(exists).toBe(false);
		expect(saf.path).toBe('');
	});

	test('saf.name returns the file slug name', () => {
		const saf = getTestFile('test.txt');
		expect(saf.base).toBe('test');
	});

	test('delete method keeps the handle when specified', async () => {
		const saf = getTestFile('delete_keep_handle.txt');
		await saf.write('To be deleted but handle kept');
		expect(saf.name).toBe('delete_keep_handle.txt');
		await saf.delete('keep_handle');
		expect(saf.name).toBe('delete_keep_handle.txt');

		const exists = await saf.exists();
		expect(exists).toBe(false);
	});

	test('isDirectory correctly identifies a directory', async () => {
		await mkdir(path.resolve(TEST_DIR, 'some_directory'), { recursive: true });
		const saf = getTestFile('some_directory');

		const isDir = await saf.isDirectory();
		expect(isDir).toBe(true);
	});

	test('directory returns an absolute path', () => {
		const saf = getTestFile('test.txt');
		expect(saf.directory).toBe(path.resolve(TEST_DIR));
	});

	test('isDirectory correctly identifies a file', async () => {
		const saf = getTestFile('some_file.txt');
		await saf.write('I am a file.');

		const isDir = await saf.isDirectory();
		expect(isDir).toBe(false);
	});

	test('File directory is correct', () => {
		const saf = getTestFile('some_file.txt');
		expect(saf.directory).toBe(TEST_DIR);
	});

	test('ensureDirectory creates the directory if it does not exist', async () => {
		const saf = getTestFile('new_dir/test_dir/test.txt');
		await saf.ensureDirectory();

		const directory = SAF.from(saf.directory);
		const exists = await directory.exists();
		expect(exists).toBe(true);
	});

	test('edit method modifies the file content', async () => {
		const saf = getTestFile('edit_test.txt');
		await saf.write('Original Content');

		await saf.edit(content => content.replace('Original', 'Modified'));
		const modifiedContent = await saf.file.text();
		expect(modifiedContent).toBe('Modified Content');
	});

	test('unsafe method disables safeMode', () => {
		const saf = getTestFile('unsafe_test.txt');
		saf.unsafe();
		expect(saf.safeMode).toBe(false);
	});

	test('safe method enables safeMode', () => {
		const saf = getTestFile('safe_test.txt');
		saf.unsafe();
		saf.safe();
		expect(saf.safeMode).toBe(true);
	});

	test('getters and setters for base, name, extension, path, and directory work correctly', async () => {
		const saf = getTestFile('base_name.txt');
		expect(saf.base).toBe('base_name');
		expect(saf.extension).toBe('.txt');
		expect(saf.directory).toBe(TEST_DIR);

		saf.base = 'new_base';
		await saf.update();
		expect(saf.path).toBe(path.join(TEST_DIR, 'new_base.txt'));

		saf.base = 'new_name';
		await saf.update();
		expect(saf.path).toBe(path.join(TEST_DIR, 'new_name.txt'));

		saf.extension = '.md';
		await saf.update();
		expect(saf.path).toBe(path.join(TEST_DIR, 'new_name.md'));

		saf.directory = path.join(TEST_DIR, 'subdir');
		await saf.update();
		expect(saf.path).toBe(path.join(TEST_DIR, 'subdir', 'new_name.md'));
	});

	test('generates safe paths and unique filenames', async () => {
		const duplicateBase = 'safe_path_test';

		const getUpdatedFilename = async () => {
			const file = getTestFile('test.txt');
			file.base = duplicateBase;
			await file.update();
			return file;
		};

		const file1 = await getUpdatedFilename();
		await file1.write('test');
		expect(file1.base).toBe(duplicateBase);
		expect(file1.path).toBe(path.join(TEST_DIR, `${duplicateBase}.txt`));

		// Test creating the same file again
		const file2 = await getUpdatedFilename();
		await file2.write('test2');

		expect(file2.path).not.toBe(file1.path);
		expect(file2.base).toBe(`${duplicateBase}_1`);

		// Test creating the same file again
		const file3 = await getUpdatedFilename();
		await file3.write('test3');
		expect(file3.base).toBe(`${duplicateBase}_2`);
		expect(file3.path).toBe(path.join(TEST_DIR, `${duplicateBase}_2.txt`));
	});

	test('throws error after too many duplicate attempts', async () => {
		// Create many numbered files to force the error
		const baseName = 'error_safe_path_test.txt';
		const promises = Array.from({ length: 11 }, async (_, i) => {
			await $`touch ${i === 0 ? baseName : `error_safe_path_test_${i}.txt`}`;
		});
		await Promise.all(promises);

		// Attempt to create one more
		expect(SAF.prepare(path.join(TEST_DIR, baseName))).rejects.toThrow(
			`Failed to find a safe path for ${path.join(TEST_DIR, baseName)}`,
		);
	});

	test('bytes method returns correct binary content', async () => {
		const saf = getTestFile('binary_file.bin');
		const buffer = new Uint8Array([0x00, 0xff, 0x7e, 0x80]);
		await saf.write(buffer);
		const bytes = await saf.bytes();
		expect(bytes).toEqual(buffer);
	});

	test('toString method returns correct file path', () => {
		const saf = getTestFile('string_test.txt');
		expect(saf.toString()).toBe(saf.path);
	});

	test('static prepare creates SAF instance with safe path when target exists', async () => {
		const existingFilePath = path.join(TEST_DIR, 'existing_file.txt');
		await SAF.from(TEST_DIR, 'existing_file.txt').write('Existing content');

		const preparedSAF = await SAF.prepare(existingFilePath);
		expect(preparedSAF.path).toBe(path.join(TEST_DIR, 'existing_file_1.txt'));
	});

	test('static prepare creates SAF instance with original path when target does not exist', async () => {
		const newFilePath = path.join(TEST_DIR, 'new_file.txt');
		const preparedSAF = await SAF.prepare(newFilePath);
		expect(preparedSAF.path).toBe(newFilePath);
	});

	describe('isDirectory', () => {
		test('returns false for non-existent paths', async () => {
			const saf = getTestFile('non_existent_directory');
			expect(await saf.isDirectory()).toBe(false);
		});

		test('returns true only for existing directories', async () => {
			const dirPath = path.resolve(TEST_DIR, 'test_directory');
			await mkdir(dirPath, { recursive: true });
			const saf = getTestFile('test_directory');
			expect(await saf.isDirectory()).toBe(true);
		});

		test('returns false for files', async () => {
			const saf = getTestFile('test_file.txt');
			await saf.write('content');
			expect(await saf.isDirectory()).toBe(false);
		});
	});

	describe('exists', () => {
		test('returns false for non-existent paths', async () => {
			const saf = getTestFile('non_existent');
			expect(await saf.exists()).toBe(false);
		});

		test('returns true for files', async () => {
			const saf = getTestFile('existing_file.txt');
			await saf.write('content');
			expect(await saf.exists()).toBe(true);
		});

		test('returns true for directories', async () => {
			const dirPath = path.resolve(TEST_DIR, 'existing_directory');
			await mkdir(dirPath, { recursive: true });
			const saf = getTestFile('existing_directory');
			expect(await saf.exists()).toBe(true);
		});
	});

	describe('isFile', () => {
		test('returns false for non-existent paths', async () => {
			const saf = getTestFile('non_existent_file.txt');
			expect(await saf.isFile()).toBe(false);
		});

		test('returns false for directories', async () => {
			const dirPath = path.resolve(TEST_DIR, 'test_directory');
			await mkdir(dirPath, { recursive: true });
			const saf = getTestFile('test_directory');
			expect(await saf.isFile()).toBe(false);
		});

		test('returns true only for existing files', async () => {
			const saf = getTestFile('test_file.txt');
			await saf.write('content');
			expect(await saf.isFile()).toBe(true);
		});
	});
});
