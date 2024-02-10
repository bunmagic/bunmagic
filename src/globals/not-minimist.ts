/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type Flag = string | number | boolean | undefined;
type NmArgv = {
	flags: Record<string, Flag>;
	args: string[];
};
export function notMinimist(args: string[]) {
	const output: NmArgv = {
		flags: {},
		args: []
	};

	for (let i = 0; i < args.length; i++) {
		let value: string | number | boolean | undefined;
		const arg = args[i];
		if (arg.startsWith("--") || arg.startsWith("-")) {
			let [key, rawValue] = arg.replace(/^--?/, '').split("=");
			value = rawValue;
			if (value === undefined) {
				const nextArg = args[i + 1];
				if (nextArg && !nextArg.startsWith("-")) {
					value = nextArg;
					i++;
				} else {
					value = true;
				}
			}

			if (typeof value !== 'boolean' && !isNaN(value as any)) {
				value = parseInt(value);
			}
			output.flags[key] = value;
		} else {
			output.args.push(arg);
		}
	}

	return {
		_: output.args,
		...output.flags,
	} as Record<string, string | boolean | undefined> & { _: string[] };
}