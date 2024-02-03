/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type Flag = string | boolean | undefined;
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
		const arg = args[i];
		if (arg.startsWith("--")) {
			const [key, value] = arg.slice(2).split("=");
			if (!value) {
				const nextArg = args[i + 1];
				if (nextArg && !nextArg.startsWith("--")) {
					output.flags[key] = nextArg;
					i++;
					continue;
				} else {
					output.flags[key] = true;
				}
			}
		} else {
			output.args.push(arg);
		}
	}
	// @TODO: handle false flags --flag-name=false
	return {
		...output.flags,
		_: output.args
	} as Record<string, string | boolean | undefined> & { _: string[] };
}