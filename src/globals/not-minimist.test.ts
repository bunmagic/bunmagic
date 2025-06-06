import { describe, expect, it } from 'bun:test';
import { notMinimist } from './not-minimist';

describe('notMinimist', () => {
	it('should parse arguments without flags as args array', () => {
		const result = notMinimist(['arg1', 'arg2']);
		expect(result).toEqual({ flags: {}, args: ['arg1', 'arg2'] });
	});

	it('should parse flags with boolean true if no value is provided', () => {
		const result = notMinimist(['--flag']);
		expect(result.flags.flag).toBe(true);
	});

	it('should parse flags with string values', () => {
		const result = notMinimist(['--key=value']);
		expect(result.flags.key).toBe('value');
	});

	it('should parse flags with numeric values', () => {
		const result = notMinimist(['--number=123', '--number2=0', '--number3', '123']);
		expect(result.flags.number).toBe(123);
		expect(result.flags.number2).toBe(0);
		expect(result.flags.number3).toBe(123);
	});

	it('should handle mixed arguments and flags correctly', () => {
		const result = notMinimist(['arg1', '--flag', 'arg2', '--key=value', '--number=123']);
		expect(result).toEqual({
			flags: { flag: 'arg2', key: 'value', number: 123 },
			args: ['arg1'],
		});
	});

	it('should parse various types of boolean flags', () => {
		const result = notMinimist([
			'--true1',
			'--true2=true',
			'--true3',
			'true',
			'--false1=false',
			'--false2',
			'false',
		]);
		expect(result.flags.true1).toBe(true);
		expect(result.flags.true2).toBe(true);
		expect(result.flags.true3).toBe(true);
		expect(result.flags.false1).toBe(false);
		expect(result.flags.false2).toBe(false);
	});

	it('should override flags that appear multiple times with the last value', () => {
		const result = notMinimist(['--key=first', '--key=second']);
		expect(result.flags.key).toBe('second');
	});

	it('should treat non-prefixed values following a flag as the flag value if not another flag', () => {
		const result = notMinimist(['--key', 'value']);
		expect(result.flags.key).toBe('value');
	});

	it('should treat the next value as a separate arg if it starts with a dash', () => {
		const result = notMinimist(['--key', '--anotherKey']);
		expect(result.flags.key).toBe(true);
		expect(result.flags.anotherKey).toBe(true);
	});
});
