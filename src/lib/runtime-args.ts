import { notMinimist } from '../globals/not-minimist';

type RuntimeArgs = {
	args: string[];
	flags: Record<string, string | number | boolean | undefined>;
	argv: Record<string, string | number | boolean | string[] | undefined>;
};

const RUNTIME_ARGS_KEY = Symbol.for('bunmagic.runtime-args');

type RuntimeGlobal = typeof globalThis & {
	[RUNTIME_ARGS_KEY]?: RuntimeArgs;
};

function parseArgv(input: string[]): RuntimeArgs {
	const { args, flags } = notMinimist(input);
	return {
		args,
		flags,
		argv: { _: args, ...flags },
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
