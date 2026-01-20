import { $ } from 'bun';
import { describe, expect, test } from 'bun:test';

describe('help ANSI regression', () => {
	test('exec --help should not leak raw ANSI fragments', async () => {
		const output = await $`FORCE_COLOR=1 NO_COLOR= TERM=xterm-256color bun src/bin/bunmagic.ts exec --help | cat -v`.text();
		expect(output).not.toContain('^[[33m[33m<file>');
	});
});
