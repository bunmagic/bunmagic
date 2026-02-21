import { beforeEach, describe, expect, test } from 'bun:test';
import { getRuntimeArgs, setRuntimeArgv } from '../runtime-args';

beforeEach(() => {
	setRuntimeArgv([]);
});

describe('runtime args typed accessors', () => {
	test('keeps plain flags and array-style args behavior', () => {
		const runtimeArgs = setRuntimeArgv(['alpha', '42', '--debug', '--target', 'project']);
		expect(runtimeArgs.flags.debug).toBe(true);
		expect(runtimeArgs.flags.target).toBe('project');
		expect(runtimeArgs.args[0]).toBe('alpha');
		expect(runtimeArgs.args.join(' ')).toBe('alpha 42');
		expect(runtimeArgs.args.slice(1)).toEqual(['42']);
		expect([...runtimeArgs.args]).toEqual(['alpha', '42']);
		expect(Array.isArray(runtimeArgs.args)).toBe(true);
		expect(typeof runtimeArgs.flags).toBe('object');
	});

	test('supports chain-only typed flag access', () => {
		const runtimeArgs = setRuntimeArgv(['--retries', '7', '--mode', 'fast', '--debug']);
		expect(runtimeArgs.flag('retries').int().default(3)).toBe(7);
		expect(runtimeArgs.flag('mode').enum('fast', 'safe').required()).toBe('fast');
		expect(runtimeArgs.flag('missing').int().default(3)).toBe(3);
		expect(runtimeArgs.flag('debug').boolean().default(false)).toBe(true);
	});

	test('supports custom validate callbacks for flags and args', () => {
		const runtimeArgs = setRuntimeArgv(['42', '--age', '50']);
		expect(
			runtimeArgs
				.flag('age')
				.int()
				.validate(value => value > 30 && value < 100)
				.required(),
		).toBe(50);
		expect(
			runtimeArgs
				.arg(0)
				.int()
				.validate(value => value > 30 && value < 100)
				.required(),
		).toBe(42);
	});

	test('supports chain-only typed arg access', () => {
		const runtimeArgs = setRuntimeArgv(['file.ts', '5', 'fast']);
		expect(runtimeArgs.arg(0).string().required()).toBe('file.ts');
		expect(runtimeArgs.arg(1).int().required()).toBe(5);
		expect(runtimeArgs.arg(2).enum('fast', 'safe').required()).toBe('fast');
		expect(runtimeArgs.arg(3).int().default(9)).toBe(9);
	});

	test('throws clear errors for invalid typed values', () => {
		const runtimeArgs = setRuntimeArgv(['--retries', 'abc', '--mode', 'FAST']);
		expect(() => runtimeArgs.flag('retries').int().default(1)).toThrow(
			'Invalid value for --retries: expected integer, received "abc"',
		);
		expect(() => runtimeArgs.flag('mode').enum('fast', 'safe').required()).toThrow(
			'Invalid value for --mode: expected one of [fast, safe], received "FAST"',
		);
	});

	test('throws custom validation messages', () => {
		const runtimeArgs = setRuntimeArgv(['--age', '12']);
		expect(() =>
			runtimeArgs
				.flag('age')
				.int()
				.validate(value => value > 30 && value < 100, 'age must be between 31 and 99')
				.required(),
		).toThrow('age must be between 31 and 99');
	});

	test('uses default validation failure message when no custom message is provided', () => {
		const runtimeArgs = setRuntimeArgv(['--age', '12']);
		expect(() =>
			runtimeArgs
				.flag('age')
				.int()
				.validate(value => value > 30 && value < 100)
				.required(),
		).toThrow('Invalid value for --age: validation failed');
	});

	test('supports multiple validation callbacks in chain order', () => {
		const passingArgs = setRuntimeArgv(['--age', '7']);
		expect(
			passingArgs
				.flag('age')
				.int()
				.validate(value => value > 0)
				.validate(value => value < 10, 'age must be below 10')
				.required(),
		).toBe(7);

		const failingArgs = setRuntimeArgv(['--age', '12']);
		expect(() =>
			failingArgs
				.flag('age')
				.int()
				.validate(value => value > 0)
				.validate(value => value < 10, 'age must be below 10')
				.required(),
		).toThrow('age must be below 10');
	});

	test('does not run validation callback for missing optional/defaulted values', () => {
		const runtimeArgs = setRuntimeArgv([]);
		let validationsRun = 0;
		const validateMissingInt = (value: number) => {
			validationsRun += 1;
			return value > 0;
		};

		expect(runtimeArgs.flag('age').int().validate(validateMissingInt).optional()).toBeUndefined();
		expect(runtimeArgs.flag('age').int().validate(validateMissingInt).default(5)).toBe(5);
		expect(validationsRun).toBe(0);
	});

	test('keeps mutable plain flags behavior used by commands', () => {
		const runtimeArgs = setRuntimeArgv(['--namespace', 'tools']);
		expect(runtimeArgs.flags.namespace).toBe('tools');
		runtimeArgs.flags.namespace = undefined;
		expect(runtimeArgs.flags.namespace).toBeUndefined();
		expect(runtimeArgs.flag('namespace').string().optional()).toBeUndefined();
	});

	test('collision keys stay plain-object semantics', () => {
		const runtimeArgs = setRuntimeArgv([]);
		expect(runtimeArgs.flags.name).toBeUndefined();
		expect(runtimeArgs.flags.length).toBeUndefined();
		expect('name' in runtimeArgs.flags).toBe(false);
		expect('length' in runtimeArgs.flags).toBe(false);
		expect(Object.hasOwn(runtimeArgs.flags, 'name')).toBe(false);
		expect(Object.hasOwn(runtimeArgs.flags, 'length')).toBe(false);
	});

	test('plain args introspection paths do not throw', () => {
		const runtimeArgs = setRuntimeArgv(['a', 'b']);
		expect(() => Object.keys(runtimeArgs.args)).not.toThrow();
		expect(() => Object.hasOwn(runtimeArgs.args, 'length')).not.toThrow();
		expect(() => Object.assign({}, runtimeArgs.args)).not.toThrow();
		expect(() => ({ ...runtimeArgs.args })).not.toThrow();
	});
});

describe('runtime args singleton access', () => {
	test('getRuntimeArgs returns arg/flag accessors too', () => {
		setRuntimeArgv(['hello', '--count', '4']);
		const runtimeArgs = getRuntimeArgs();
		expect(runtimeArgs.arg(0).string().required()).toBe('hello');
		expect(runtimeArgs.flag('count').int().required()).toBe(4);
		expect(runtimeArgs.args.join(' ')).toBe('hello');
	});
});
