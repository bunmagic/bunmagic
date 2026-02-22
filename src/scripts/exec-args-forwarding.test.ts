import { afterEach, describe, expect, test } from 'bun:test';
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dir, '..', '..');
const BUNMAGIC_BIN = path.join(REPO_ROOT, 'src', 'bin', 'bunmagic.ts');
const BUNMAGIC_EXEC_BIN = path.join(REPO_ROOT, 'src', 'bin', 'bunmagic-exec.ts');
const BUNMAGIC_EXEC_NAMESPACE_BIN = path.join(
	REPO_ROOT,
	'src',
	'bin',
	'bunmagic-exec-namespace.ts',
);
const BUNMAGIC_SOURCE_PATH = path.join(REPO_ROOT, 'src', 'scripts');

type PackageMode = 'same-instance' | 'second-instance';
type CommandResult = {
	stdout: string;
	stderr: string;
	exitCode: number;
};

type Fixture = {
	tempRoot: string;
	scriptDir: string;
	probePath: string;
	probeName: string;
};

const cleanupTargets: string[] = [];

function registerCleanup(tempRoot: string) {
	cleanupTargets.push(tempRoot);
}

async function createFixture(mode: PackageMode, probeName = 'probe.ts'): Promise<Fixture> {
	const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'bunmagic-exec-args-'));
	registerCleanup(tempRoot);

	const scriptDir = path.join(tempRoot, 'script');
	const nodeModules = path.join(scriptDir, 'node_modules');
	const probePath = path.join(scriptDir, probeName);
	const packagePath = mode === 'same-instance' ? REPO_ROOT : path.join(tempRoot, 'alt-bunmagic');

	await mkdir(nodeModules, { recursive: true });

	if (mode === 'second-instance') {
		await cp(path.join(REPO_ROOT, 'package.json'), path.join(packagePath, 'package.json'));
		await cp(path.join(REPO_ROOT, 'src'), path.join(packagePath, 'src'), {
			recursive: true,
		});
	}

	await symlink(packagePath, path.join(nodeModules, 'bunmagic'));
	await writeFile(
		probePath,
		[
			"import { args, flags, passthroughArgs } from 'bunmagic';",
			'console.log("ARGS=" + JSON.stringify(args));',
			'console.log("PASSTHROUGH=" + JSON.stringify(passthroughArgs));',
			'console.log("FLAGS=" + JSON.stringify(flags));',
		].join('\n'),
	);

	return {
		tempRoot,
		scriptDir,
		probePath,
		probeName,
	};
}

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

function parseReportedArgs(stdout: string): string[] {
	const match = stdout.match(/ARGS=(\[[^\n]*\])/);
	if (!match) {
		throw new Error(`Probe script did not report args.\nstdout:\n${stdout}`);
	}

	return JSON.parse(match[1]) as string[];
}

function parseReportedPassthrough(stdout: string): string[] {
	const match = stdout.match(/PASSTHROUGH=(\[[^\n]*\])/);
	if (!match) {
		throw new Error(`Probe script did not report passthrough args.\nstdout:\n${stdout}`);
	}

	return JSON.parse(match[1]) as string[];
}

function parseReportedFlags(stdout: string): Record<string, string | number | boolean | undefined> {
	const match = stdout.match(/FLAGS=(\{[^\n]*\})/);
	if (!match) {
		throw new Error(`Probe script did not report flags.\nstdout:\n${stdout}`);
	}

	return JSON.parse(match[1]) as Record<string, string | number | boolean | undefined>;
}

function expectOk(result: CommandResult) {
	expect(result.exitCode).toBe(0);
	expect(result.stderr).toBe('');
}

describe('bunmagic exec argument ordering', () => {
	afterEach(async () => {
		while (cleanupTargets.length > 0) {
			const target = cleanupTargets.pop();
			if (!target) {
				continue;
			}

			await rm(target, { recursive: true, force: true });
		}
	});

	test('bunmagic exec forwards payload args in order (same package instance)', async () => {
		const fixture = await createFixture('same-instance');
		const result = await run(
			['bun', BUNMAGIC_BIN, 'exec', `./${fixture.probeName}`, 'SRC', 'DOC'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic exec forwards payload args in order (second package instance)', async () => {
		const fixture = await createFixture('second-instance');
		const result = await run(
			['bun', BUNMAGIC_BIN, 'exec', `./${fixture.probeName}`, 'SRC', 'DOC'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic exec preserves payload order with absolute script path', async () => {
		const fixture = await createFixture('second-instance');
		const result = await run(
			['bun', BUNMAGIC_BIN, 'exec', fixture.probePath, 'ONE', 'TWO'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['ONE', 'TWO']);
	});

	test('bunmagic exec with --namespace preserves payload args when payload is positional', async () => {
		const fixture = await createFixture('second-instance');
		const result = await run(
			['bun', BUNMAGIC_BIN, 'exec', `./${fixture.probeName}`, 'SRC', 'DOC', '--namespace', 'docs'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic exec exposes tokens after -- via passthroughArgs without empty-key flags', async () => {
		const fixture = await createFixture('second-instance');
		const result = await run(
			[
				'bun',
				BUNMAGIC_BIN,
				'exec',
				`./${fixture.probeName}`,
				'auth issue',
				'--',
				'--min-score',
				'0.2',
				'-n',
				'5',
			],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['auth issue']);
		expect(parseReportedPassthrough(result.stdout)).toEqual(['--min-score', '0.2', '-n', '5']);
		expect(parseReportedFlags(result.stdout)).toEqual({});
	});

	test('bunmagic exec handles script paths with spaces without shifting args', async () => {
		const fixture = await createFixture('second-instance', 'probe spaced.ts');
		const result = await run(
			['bun', BUNMAGIC_BIN, 'exec', './probe spaced.ts', 'LEFT', 'RIGHT'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['LEFT', 'RIGHT']);
	});

	test('bunmagic-exec-namespace forwards payload args in order (same package instance)', async () => {
		const fixture = await createFixture('same-instance');
		const result = await run(
			[
				'bun',
				BUNMAGIC_EXEC_NAMESPACE_BIN,
				BUNMAGIC_SOURCE_PATH,
				'bunmagic',
				'exec',
				`./${fixture.probeName}`,
				'SRC',
				'DOC',
			],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic-exec-namespace forwards payload args in order', async () => {
		const fixture = await createFixture('second-instance');
		const result = await run(
			[
				'bun',
				BUNMAGIC_EXEC_NAMESPACE_BIN,
				BUNMAGIC_SOURCE_PATH,
				'bunmagic',
				'exec',
				`./${fixture.probeName}`,
				'SRC',
				'DOC',
			],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic-exec forwards payload args in order (same package instance)', async () => {
		const fixture = await createFixture('same-instance');
		const result = await run(
			['bun', BUNMAGIC_EXEC_BIN, fixture.probePath, 'probe', 'SRC', 'DOC'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic-exec forwards payload args in order', async () => {
		const fixture = await createFixture('second-instance');
		const result = await run(
			['bun', BUNMAGIC_EXEC_BIN, fixture.probePath, 'probe', 'SRC', 'DOC'],
			fixture.scriptDir,
		);

		expectOk(result);
		expect(parseReportedArgs(result.stdout)).toEqual(['SRC', 'DOC']);
	});

	test('bunmagic exec without file shows usage and exits cleanly', async () => {
		const result = await run(['bun', BUNMAGIC_BIN, 'exec'], REPO_ROOT);

		expect(result.exitCode).toBe(0);
		expect(result.stderr).toBe('');
		expect(result.stdout).toContain('Usage:');
		expect(result.stdout).toContain('exec <file> [args...]');
	});
});
