import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import ansis from 'ansis';
import { displayScriptHelp } from '../help-display';
import { Script } from '../script';

// Mock globals for tests
global.path = require('node:path');
global.ansis = ansis;

// Mock console.log to capture output
let consoleOutput: string[] = [];
const originalConsoleLog = console.log;

beforeEach(() => {
	consoleOutput = [];
	console.log = (...args: unknown[]) => {
		consoleOutput.push(args.map(arg => String(arg)).join(' '));
	};
});

// Restore console.log after tests
afterEach(() => {
	console.log = originalConsoleLog;
});

describe('displayScriptHelp', () => {
	test('should display basic script info without namespace', () => {
		const script = new Script({
			source: '/test/script.ts',
			slug: 'script',
			desc: 'Test script description',
		});

		displayScriptHelp(script);

		expect(consoleOutput).toContain('');
		expect(consoleOutput).toContain(`\n  ${ansis.bold(script.command)}`);
		expect(consoleOutput).toContain('  Test script description');
	});

	test('should display script info with namespace', () => {
		const script = new Script({
			source: '/test/script.ts',
			slug: 'script',
			desc: 'Test script description',
		});

		displayScriptHelp(script, 'n8');

		expect(consoleOutput).toContain('');
		// The title doesn't include namespace, only the command name
		expect(consoleOutput).toContain(`\n  ${ansis.bold('script')}`);
		expect(consoleOutput).toContain('  Test script description');
	});

	test('should handle usage line without duplication', () => {
		const script = new Script({
			source: '/test/update.ts',
			slug: 'update',
			desc: 'Update an existing workflow',
			usage: {
				name: 'n8',
				description: 'update <workflow-id> [options]',
			},
		});

		displayScriptHelp(script, 'n8');

		const output = consoleOutput.join('\n');

		// Check that the usage line appears
		expect(output).toContain('Usage:');

		// Find the usage line (skip the title which also contains 'update')
		const usageLineIndex = consoleOutput.findIndex(
			line => line.includes('update') && line.includes('<workflow-id>'),
		);
		const usageLine = consoleOutput[usageLineIndex];

		// The usage line should NOT contain duplicate "update" commands
		const updateCount = (usageLine.match(/update/g) || []).length;
		expect(updateCount).toBe(1);

		// It should properly format as "n8 update <workflow-id> [options]"
		expect(usageLine).toContain('n8 update');
		expect(usageLine).toContain('<workflow-id>');
		expect(usageLine).toContain('[options]');
	});

	test('should properly highlight parameters', () => {
		const script = new Script({
			source: '/test/update.ts',
			slug: 'update',
			desc: 'Update an existing workflow',
			usage: {
				name: 'update',
				description: '<workflow-id> [options]',
			},
		});

		displayScriptHelp(script, 'n8');

		const output = consoleOutput.join('\n');

		// Check that parameters are highlighted with ansi colors
		const usageLineIndex = consoleOutput.findIndex(line => line.includes('workflow-id'));

		if (usageLineIndex === -1) {
			console.error(
				'Could not find usage line with workflow-id. Full output:',
				JSON.stringify(consoleOutput, null, 2),
			);
			throw new Error('Usage line not found');
		}

		const usageLine = consoleOutput[usageLineIndex];

		// Should contain yellow color codes for parameters
		expect(usageLine).toContain(ansis.yellow('<workflow-id>'));
		expect(usageLine).toContain(ansis.dim(ansis.yellow('[options]')));
	});

	test('should handle usage with namespace correctly', () => {
		const script = new Script({
			source: '/test/activate.ts',
			slug: 'activate',
			desc: 'Activate workflows',
			usage: {
				name: 'n8',
				description: 'activate --all [options]',
			},
		});

		displayScriptHelp(script, 'n8');

		const output = consoleOutput.join('\n');
		const usageLineIndex = consoleOutput.findIndex(line => line.includes('activate'));
		const usageLine = consoleOutput[usageLineIndex];

		// The title line is different from usage line
		// Find the actual usage content line
		const titleIndex = consoleOutput.findIndex(line => line === `\n  ${ansis.bold('activate')}`);
		expect(titleIndex).toBeGreaterThan(-1);

		// The usage line should be after the Usage: header
		const actualUsageLineIndex = consoleOutput.findIndex(
			(line, idx) => idx > titleIndex && line.includes('activate') && line.includes('[options]'),
		);
		const actualUsageLine = consoleOutput[actualUsageLineIndex];

		// Should show "n8 activate --all [options]" without duplication
		expect(actualUsageLine).toContain('n8 activate');
		const activateCount = (actualUsageLine.match(/activate/g) || []).length;
		expect(activateCount).toBe(1);
	});

	test('should display flags with proper formatting', () => {
		const script = new Script({
			source: '/test/script.ts',
			slug: 'script',
			desc: 'Test script',
			meta: {
				flags: [
					{ name: '--verbose', description: 'Enable verbose output' },
					{ name: '--config <path>', description: 'Configuration file path' },
					{ name: '--output [file]', description: 'Optional output file' },
				],
			},
		});

		displayScriptHelp(script);

		const output = consoleOutput.join('\n');

		expect(output).toContain('Flags:');
		expect(output).toContain(ansis.cyan('--verbose'));
		expect(output).toContain(ansis.cyan('--config'));
		expect(output).toContain(ansis.yellow('<path>'));
		expect(output).toContain(ansis.cyan('--output'));
		expect(output).toContain(ansis.dim(ansis.yellow('[file]')));
	});

	test('should display examples with namespace stripping', () => {
		const script = new Script({
			source: '/test/activate.ts',
			slug: 'activate',
			desc: 'Activate workflows',
			meta: {
				example: [
					{ name: 'n8', description: 'activate 123 --activate' },
					{ name: 'n8', description: 'activate --all --deactivate' },
				],
			},
		});

		displayScriptHelp(script, 'n8');

		const output = consoleOutput.join('\n');

		expect(output).toContain('Example:');
		// Examples should be shown without the namespace prefix
		expect(output).toContain(ansis.cyan('activate 123 --activate'));
		expect(output).toContain(ansis.cyan('activate --all --deactivate'));

		// Should NOT contain duplicate namespace
		const n8Count = (output.match(/n8 n8/g) || []).length;
		expect(n8Count).toBe(0);
	});

	test('should handle edge case where usage.description already contains command', () => {
		const script = new Script({
			source: '/test/update.ts',
			slug: 'update',
			desc: 'Update workflow',
			usage: {
				name: 'n8',
				description: 'update <id>',
			},
		});

		displayScriptHelp(script, 'n8');

		const usageLineIndex = consoleOutput.findIndex(line => line.includes('update'));
		const usageLine = consoleOutput[usageLineIndex];

		// Find the actual usage line (not the title)
		const titleIndex = consoleOutput.findIndex(line => line === `\n  ${ansis.bold('update')}`);
		const actualUsageLineIndex = consoleOutput.findIndex(
			(line, idx) => idx > titleIndex && line.includes('update') && line.includes('<'),
		);
		const actualUsageLine = consoleOutput[actualUsageLineIndex];

		// Should show "n8 update <id>" not "n8 update update <id>"
		const updateCount = (actualUsageLine.match(/update/g) || []).length;
		expect(updateCount).toBe(1);
		expect(actualUsageLine).toContain('n8 update');
	});

	test('regression: should not duplicate usage description with ANSI color codes', () => {
		// This is the exact bug we fixed - ANSI color codes preventing duplicate detection
		const script = new Script({
			source: '/test/docblocks.ts',
			slug: 'docblocks',
			desc: 'List n8n workflows',
			usage: {
				name: 'n8',
				description: 'list [options]',
			},
			meta: {
				flags: [
					{ name: '-a, --active', description: 'Show only active workflows' },
					{ name: '-l, --limit <n>', description: 'Number of workflows to show (default: 10)' },
					{ name: '-j, --json', description: 'Output full JSON response' },
				],
			},
		});

		displayScriptHelp(script, 'n8');

		// Find the usage line
		const usageLineIndex = consoleOutput.findIndex(
			line => line.includes('docblocks') && line.includes('[options]'),
		);
		const usageLine = consoleOutput[usageLineIndex];

		// Strip ANSI codes to check the actual content
		const strippedUsage = ansis.strip(usageLine);

		// Bug reproduced: Without the fix, this would show "n8 docblocks list [options] list [options]"
		// With the fix, it should show "n8 docblocks list [options]"
		const listOptionsCount = (strippedUsage.match(/list \[options\]/g) || []).length;
		expect(listOptionsCount).toBe(1);

		// Verify the exact expected output
		expect(strippedUsage.trim()).toBe('n8 docblocks list [options]');
	});

	test('regression: color codes in [options] should not break duplicate detection', () => {
		// Test that specifically checks the ANSI stripping logic
		const script = new Script({
			source: '/test/command.ts',
			slug: 'command',
			desc: 'Test command',
			usage: {
				name: 'app',
				description: 'run [options]',
			},
		});

		displayScriptHelp(script, 'app');

		const usageLineIndex = consoleOutput.findIndex(
			line => line.includes('command') && line.includes('[options]'),
		);
		const usageLine = consoleOutput[usageLineIndex];

		// The usage line will have ANSI codes like:
		// "app command run \x1b[2m\x1b[33m[options]\x1b[39m\x1b[22m"
		// Without ansis.strip() in the duplicate check, it would append "run [options]" again

		// Verify that [options] appears exactly once
		const strippedUsage = ansis.strip(usageLine);
		const optionsCount = (strippedUsage.match(/\[options\]/g) || []).length;
		expect(optionsCount).toBe(1);

		// And "run" appears exactly once
		const runCount = (strippedUsage.match(/run/g) || []).length;
		expect(runCount).toBe(1);
	});

	test('should still append description when it is not already included', () => {
		// Test case where description should be appended
		const script = new Script({
			source: '/test/deploy.ts',
			slug: 'deploy',
			desc: 'Deploy application',
			usage: {
				name: 'deploy',
				description: '--prod',
			},
		});

		displayScriptHelp(script, 'myapp');

		const usageLineIndex = consoleOutput.findIndex(line => line.includes('myapp deploy'));
		const usageLine = consoleOutput[usageLineIndex];

		// Should show "myapp deploy --prod"
		const strippedUsage = ansis.strip(usageLine);
		expect(strippedUsage.trim()).toBe('myapp deploy --prod');
	});
});
