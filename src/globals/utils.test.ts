import { describe, expect, test } from 'bun:test';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(import.meta.dir, '..', '..');
const DIE_DEPRECATION_MESSAGE =
	'[bunmagic] die() is deprecated and will be removed in v2.0.0. Use `throw new Exit(...)` instead.';

function countOccurrences(content: string, needle: string) {
	return content.split(needle).length - 1;
}

async function runDieDeprecationProbe(silenceDeprecations = false) {
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
			`import 'bunmagic/globals';
die(0);`,
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

describe('die deprecation warnings', () => {
	test('emits deprecation warning', async () => {
		const result = await runDieDeprecationProbe();
		expect(result.exitCode).toBe(0);
		expect(result.stdout).toBe('');
		expect(countOccurrences(result.stderr, DIE_DEPRECATION_MESSAGE)).toBe(1);
	});

	test('suppresses deprecation warning when BUNMAGIC_SILENCE_DEPRECATIONS=1', async () => {
		const result = await runDieDeprecationProbe(true);
		expect(result.exitCode).toBe(0);
		expect(result.stderr).not.toContain(DIE_DEPRECATION_MESSAGE);
	});
});
