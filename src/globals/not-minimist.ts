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
export function notMinimist(arguments_: string[]): NmArgv {
	const output: NmArgv = {
		flags: {},
		args: [],
	};

	for (let index = 0; index < arguments_.length; index++) {
		let value: string | number | boolean | undefined;
		const argument = arguments_[index];
		if (argument.startsWith('-')) {
			const [key, rawValue] = argument.replace(/^--?/, '').split('=');
			value = rawValue;
			if (value === undefined) {
				const nextArgument = arguments_[index + 1];
				if (nextArgument && !nextArgument.startsWith('-')) {
					value = nextArgument;
					index++;
				} else {
					value = true;
				}
			}

			if (typeof value !== 'boolean' && !Number.isNaN(Number.parseInt(value, 10))) {
				value = Number.parseInt(value, 10);
			}

			output.flags[key] = value;
		} else {
			output.args.push(argument);
		}
	}

	return output;
}
