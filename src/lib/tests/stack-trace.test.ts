import { describe, expect, test } from 'bun:test';

import { findCallerScriptPath } from '../stack-trace';

describe('findCallerScriptPath', () => {
	test('returns first non-bunmagic frame for async stacks', () => {
		const root = '/fake/bunmagic/src';
		const stack: string[] = [
			'Error',
			'    at showHelp (/fake/bunmagic/src/globals/help.ts:10:5)',
			'    at showHelp (/fake/bunmagic/src/globals/help.ts:11:5)',
			'    at userDefault (/Users/tester/project/b.ts:5:1)',
		];

		expect(findCallerScriptPath(stack, root)).toBe('/Users/tester/project/b.ts');
	});

	test('handles file urls and frames without parentheses', () => {
		const root = '/fake/bunmagic/src';
		const stack: string[] = [
			'Error',
			'    at showHelp (file:///fake/bunmagic/src/globals/help.ts:10:5)',
			'    at file:///Users/tester/project/b.ts:5:1',
		];

		expect(findCallerScriptPath(stack, root)).toBe('/Users/tester/project/b.ts');
	});

	test('returns undefined when no caller is found', () => {
		const root = '/fake/bunmagic/src';
		const stack: string[] = [
			'Error',
			'    at showHelp (/fake/bunmagic/src/globals/help.ts:10:5)',
		];

		expect(findCallerScriptPath(stack, root)).toBeUndefined();
	});

	test('falls back to internal scripts when no external caller exists', () => {
		const root = '/fake/bunmagic/src';
		const stack: string[] = [
			'Error',
			'    at showHelp (/fake/bunmagic/src/globals/help.ts:10:5)',
			'    at exec (/fake/bunmagic/src/scripts/exec.ts:12:3)',
		];

		expect(findCallerScriptPath(stack, root)).toBe('/fake/bunmagic/src/scripts/exec.ts');
	});

	test('skips native frames when resolving the caller', () => {
		const root = '/fake/bunmagic/src';
		const stack: string[] = [
			'Error',
			'    at showHelp (/fake/bunmagic/src/globals/help.ts:10:5)',
			'    at exec (/fake/bunmagic/src/scripts/exec.ts:12:3)',
			'    at processTicksAndRejections (native:7:39)',
		];

		expect(findCallerScriptPath(stack, root)).toBe('/fake/bunmagic/src/scripts/exec.ts');
	});
});
