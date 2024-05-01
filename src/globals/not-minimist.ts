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

function isFlag(argument: string): boolean {
	return argument.startsWith('-');
}

function isNumeric(value: string): boolean {
	return !Number.isNaN(Number.parseInt(value, 10));
}

function parseValue(value: string | undefined): Flag {
	if (!value) {
		return true;
	}

	if (isNumeric(value)) {
		return Number.parseInt(value, 10);
	}

	return value;
}

function isFlagWithValue(argument: string): boolean {
	return isFlag(argument) && argument.includes('=');
}

function getKeyFromArgument(argument: string): string {
	if (isFlagWithValue(argument)) {
		return argument.split('=')[0].replace(/^--?/, '');
	}

	return argument.replace(/^--?/, '');
}

function getValueFromArgument(argument: string, nextArgument?: string): string | undefined {
	if (isFlagWithValue(argument)) {
		return argument.split('=')[1] || '';
	}

	if (nextArgument && !isFlag(nextArgument)) {
		return nextArgument;
	}

	return undefined;
}

export function notMinimist(argv: string[]): NmArgv {
	const output: NmArgv = {
		flags: {},
		args: [],
	};

	for (let index = 0; index < argv.length; index++) {
		const argument = argv[index];

		if (isFlag(argument)) {
			const key = getKeyFromArgument(argument);
			const value = getValueFromArgument(argument, argv[index + 1]);
			output.flags[key] = parseValue(value);

			if (!isFlagWithValue(argument) && value !== undefined) {
				index++;
			}
		} else {
			output.args.push(argument);
		}
	}

	return output;
}

