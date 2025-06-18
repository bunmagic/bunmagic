import { describe, expect, test } from 'bun:test';
import { parseHeader, readFirstComment } from '../parse-file-meta';

const parseContent = parseHeader.fromContent;

describe('readFirstComment', () => {
	test('should return the first comment from the given view', () => {
		const view = new TextEncoder().encode(`1234/** Test comment */\nconst x = 1;/* Test comment2 */
		`);
		const comment = readFirstComment(view);
		expect(comment).toBe('/** Test comment */');
	});

	test('should return an empty string if no comment is found', () => {
		const view = new TextEncoder().encode('const x = 1;');
		const comment = readFirstComment(view);
		expect(comment).toBe('');
	});
});

describe('parseContent', () => {
	test('should parse the comment content and return the properties', async () => {
		const content = `
      /**
	   * This is a test command
       * @name [Test Command]
       * @usage <arg> test
       * @alias t
	   * @alias other
       * @flag --option Description of the option
	   * @flag [[--optional]] Description of the option
       * @subcommand sub Description of the subcommand
       * @source test.ts
       * @slug test-command
       */
    `;
		const properties = await parseContent(content);
		expect(properties).toEqual({
			name: 'Test Command',
			description: 'This is a test command',
			usage: { name: '<arg>', description: 'test' },
			meta: {
				flags: [
					{ name: '--option', description: 'Description of the option' },
					{ name: '[--optional]', description: 'Description of the option' },
				],
				subcommand: [{ name: 'sub', description: 'Description of the subcommand' }],
			},
			source: 'test.ts',
			slug: 'test-command',
			alias: ['t', 'other'],
			autohelp: false,
		});
	});

	test('should return partial properties if some tags are missing', async () => {
		const content = `
      /**
	   * This is a test command
       * @name [Test Command]
       */
    `;
		const properties = await parseContent(content);
		expect(properties).toEqual({
			name: 'Test Command',
			description: 'This is a test command',
			usage: { name: '', description: '' },
			meta: {},
			source: '',
			slug: '',
			alias: [],
			autohelp: false,
		});
	});

	test('should parse @autohelp tag correctly', async () => {
		const content = `
      /**
	   * This is a test command with autohelp
       * @autohelp
       * @usage test-cmd <input>
       */
    `;
		const properties = await parseContent(content);
		expect(properties).toEqual({
			name: '',
			description: 'This is a test command with autohelp',
			usage: { name: 'test-cmd', description: '<input>' },
			meta: {},
			source: '',
			slug: '',
			alias: [],
			autohelp: true,
		});
	});
});
