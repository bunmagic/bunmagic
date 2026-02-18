import { describe, expect, it } from 'bun:test';

describe('ANSI color code regression', () => {
	it('demonstrates the bug: string.includes() fails with ANSI codes', () => {
		// This test demonstrates why the bug occurred
		const plainText = 'list [options]';
		// Manually create ANSI colored text
		const coloredText = 'list \x1b[2m\x1b[33m[options]\x1b[39m\x1b[22m';

		// The bug: plain text is NOT found in colored text due to ANSI codes
		expect(coloredText.includes(plainText)).toBe(false);

		// The fix: strip ANSI codes before checking
		// biome-ignore lint/suspicious/noControlCharactersInRegex: Testing ANSI escape sequences
		const stripped = coloredText.replace(/\x1b\[[0-9;]*m/g, '');
		expect(stripped.includes(plainText)).toBe(true);
	});

	it('shows the exact bug scenario from docblocks.ts', () => {
		// Simulating what happens in help-display.ts
		const namespace = 'n8';
		const command = 'docblocks';
		const usageDescription = 'list [options]';

		// Step 1: Construct usage line
		let usageLine = `${namespace} ${command} ${usageDescription}`;

		// Step 2: Apply color formatting to parameters (manually add ANSI codes)
		usageLine = usageLine.replace(
			/\[([^\]]+)\]/g,
			(_match, param) => `\x1b[2m\x1b[33m[${param}]\x1b[39m\x1b[22m`,
		);

		// Now usageLine = "n8 docblocks list \x1b[2m\x1b[33m[options]\x1b[39m\x1b[22m"

		// Step 3: Check if description is already included
		// BUG: This returns false because of ANSI codes!
		const hasDescriptionBuggy = usageLine.includes(usageDescription);
		expect(hasDescriptionBuggy).toBe(false);

		// FIX: Strip ANSI codes first
		// biome-ignore lint/suspicious/noControlCharactersInRegex: Testing ANSI escape sequences
		const strippedUsageLine = usageLine.replace(/\x1b\[[0-9;]*m/g, '');
		const hasDescriptionFixed = strippedUsageLine.includes(usageDescription);
		expect(hasDescriptionFixed).toBe(true);

		// Result without fix: Would append description again
		const buggyOutput = `${usageLine}${!hasDescriptionBuggy ? ` ${usageDescription}` : ''}`;
		// biome-ignore lint/suspicious/noControlCharactersInRegex: Testing ANSI escape sequences
		const strippedBuggyOutput = buggyOutput.replace(/\x1b\[[0-9;]*m/g, '');
		expect(strippedBuggyOutput).toContain('list [options] list [options]'); // Duplication!

		// Result with fix: No duplication
		const fixedOutput = `${usageLine}${!hasDescriptionFixed ? ` ${usageDescription}` : ''}`;
		// biome-ignore lint/suspicious/noControlCharactersInRegex: Testing ANSI escape sequences
		const strippedFixedOutput = fixedOutput.replace(/\x1b\[[0-9;]*m/g, '');
		expect(strippedFixedOutput).toBe('n8 docblocks list [options]'); // No duplication
	});

	it('verifies ANSI codes are actually present in colored output', () => {
		// This test verifies that ANSI codes are indeed added
		const text = 'test [options]';
		const colored = text.replace(
			/\[([^\]]+)\]/g,
			(_match, param) => `\x1b[2m\x1b[33m[${param}]\x1b[39m\x1b[22m`,
		);

		// Verify ANSI codes are present
		expect(colored).toContain('\x1b[2m');
		expect(colored).toContain('\x1b[33m');
		expect(colored).toContain('\x1b[39m');
		expect(colored).toContain('\x1b[22m');

		// Verify stripping works
		// biome-ignore lint/suspicious/noControlCharactersInRegex: Testing ANSI escape sequences
		const stripped = colored.replace(/\x1b\[[0-9;]*m/g, '');
		expect(stripped).toBe(text);
	});
});
