import { notMinimist } from '../globals/not-minimist';

type FlagValue = string | number | boolean | undefined;

export type TypedResolver<T> = {
	default(defaultValue: T): T;
	required(message?: string): T;
	optional(): T | undefined;
	validate(check: (value: T) => boolean, message?: string): TypedResolver<T>;
};

export type TypedAccessor = {
	string(): TypedResolver<string>;
	int(): TypedResolver<number>;
	number(): TypedResolver<number>;
	boolean(): TypedResolver<boolean>;
	enum<const T extends readonly [string, ...string[]]>(...values: T): TypedResolver<T[number]>;
};

type RuntimeArgs = {
	args: string[];
	passthroughArgs: string[];
	flags: Record<string, FlagValue>;
	argv: Record<string, string | number | boolean | string[] | undefined>;
	arg: (index: number) => TypedAccessor;
	flag: (name: string) => TypedAccessor;
};

const RUNTIME_ARGS_KEY = Symbol.for('bunmagic.runtime-args');

type RuntimeGlobal = typeof globalThis & {
	[RUNTIME_ARGS_KEY]?: RuntimeArgs;
};

function formatReceived(value: unknown): string {
	if (typeof value === 'string') {
		return `"${value}"`;
	}

	if (
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		value === undefined ||
		value === null
	) {
		return String(value);
	}

	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

function createResolver<T>({
	rawValue,
	label,
	expected,
	missingMessage,
	parse,
}: {
	rawValue: unknown;
	label: string;
	expected: string;
	missingMessage: string;
	parse: (value: unknown) => T | undefined;
}): TypedResolver<T> {
	type ValidationRule = {
		check: (value: T) => boolean;
		message?: string;
	};

	const parseValue = () => {
		if (rawValue === undefined) {
			return undefined;
		}

		const parsedValue = parse(rawValue);
		if (parsedValue !== undefined) {
			return parsedValue;
		}

		throw new Error(
			`Invalid value for ${label}: expected ${expected}, received ${formatReceived(rawValue)}`,
		);
	};

	const validateValue = (value: T, rules: ValidationRule[]) => {
		for (const rule of rules) {
			if (!rule.check(value)) {
				throw new Error(rule.message ?? `Invalid value for ${label}: validation failed`);
			}
		}
	};

	const createValidatedResolver = (rules: ValidationRule[]): TypedResolver<T> => ({
		default(defaultValue: T) {
			const parsedValue = parseValue();
			if (parsedValue === undefined) {
				return defaultValue;
			}

			validateValue(parsedValue, rules);
			return parsedValue;
		},
		required(message?: string) {
			const parsedValue = parseValue();
			if (parsedValue === undefined) {
				throw new Error(message ?? missingMessage);
			}

			validateValue(parsedValue, rules);
			return parsedValue;
		},
		optional() {
			const parsedValue = parseValue();
			if (parsedValue === undefined) {
				return undefined;
			}

			validateValue(parsedValue, rules);
			return parsedValue;
		},
		validate(check: (value: T) => boolean, message?: string) {
			return createValidatedResolver([...rules, { check, message }]);
		},
	});

	return createValidatedResolver([]);
}

function parseString(value: unknown): string | undefined {
	if (typeof value === 'string') {
		return value;
	}

	return undefined;
}

function parseInteger(value: unknown): number | undefined {
	if (typeof value === 'number') {
		if (Number.isSafeInteger(value)) {
			return value;
		}

		return undefined;
	}

	if (typeof value !== 'string') {
		return undefined;
	}

	if (!/^-?\d+$/.test(value)) {
		return undefined;
	}

	const parsedValue = Number.parseInt(value, 10);
	if (Number.isSafeInteger(parsedValue)) {
		return parsedValue;
	}

	return undefined;
}

function parseNumberValue(value: unknown): number | undefined {
	if (typeof value === 'number') {
		if (Number.isFinite(value)) {
			return value;
		}

		return undefined;
	}

	if (typeof value !== 'string') {
		return undefined;
	}

	if (value.trim() === '') {
		return undefined;
	}

	const parsedValue = Number(value);
	if (Number.isFinite(parsedValue)) {
		return parsedValue;
	}

	return undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
	if (typeof value === 'boolean') {
		return value;
	}

	if (value === 'true') {
		return true;
	}

	if (value === 'false') {
		return false;
	}

	return undefined;
}

function parseEnumValue<const T extends readonly [string, ...string[]]>(
	value: unknown,
	values: T,
): T[number] | undefined {
	const stringValue =
		typeof value === 'string' ? value : typeof value === 'number' ? String(value) : undefined;
	if (stringValue === undefined) {
		return undefined;
	}

	const matchedValue = values.find(candidate => candidate === stringValue);
	if (matchedValue !== undefined) {
		return matchedValue;
	}

	return undefined;
}

class ValueAccessor implements TypedAccessor {
	public constructor(
		private readonly rawValue: unknown,
		private readonly label: string,
		private readonly missingMessage: string,
	) {}

	private createTypedResolver<T>(expected: string, parse: (value: unknown) => T | undefined) {
		return createResolver<T>({
			rawValue: this.rawValue,
			label: this.label,
			expected,
			missingMessage: this.missingMessage,
			parse,
		});
	}

	public string() {
		return this.createTypedResolver('string', parseString);
	}

	public int() {
		return this.createTypedResolver('integer', parseInteger);
	}

	public number() {
		return this.createTypedResolver('number', parseNumberValue);
	}

	public boolean() {
		return this.createTypedResolver('boolean', parseBoolean);
	}

	public enum<const T extends readonly [string, ...string[]]>(...values: T) {
		const expected = `one of [${values.join(', ')}]`;
		return this.createTypedResolver(expected, value => parseEnumValue(value, values));
	}
}

function parseArgv(input: string[]): RuntimeArgs {
	const { args, flags, passthroughArgs } = notMinimist(input);
	const arg = (index: number) => {
		const normalizedIndex = Number(index);
		return new ValueAccessor(
			args[normalizedIndex],
			`argument ${normalizedIndex}`,
			`Missing required argument at index ${normalizedIndex}`,
		);
	};
	const flag = (name: string) => {
		const label = `--${name}`;
		return new ValueAccessor(flags[name], label, `Missing required flag ${label}`);
	};

	return {
		args,
		passthroughArgs,
		flags,
		argv: { _: args, ...flags, '--': passthroughArgs },
		arg,
		flag,
	};
}

export function setRuntimeArgv(input: string[]): RuntimeArgs {
	const runtimeGlobal = globalThis as RuntimeGlobal;
	runtimeGlobal[RUNTIME_ARGS_KEY] = parseArgv(input);
	return runtimeGlobal[RUNTIME_ARGS_KEY];
}

export function getRuntimeArgs(): RuntimeArgs {
	const runtimeGlobal = globalThis as RuntimeGlobal;
	if (!runtimeGlobal[RUNTIME_ARGS_KEY]) {
		runtimeGlobal[RUNTIME_ARGS_KEY] = parseArgv(Bun.argv.slice(2) || []);
	}

	return runtimeGlobal[RUNTIME_ARGS_KEY];
}
