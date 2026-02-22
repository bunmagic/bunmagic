/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type StructuredArguments = {
	flags: Record<string, string | number | boolean | undefined>;
	args: string[];
	passthroughArgs: string[];
};

function castValue(value: string) {
	if (/^-?\d+$/.test(value)) {
		return Number.parseInt(value, 10);
	}

	if (value === 'true') {
		return true;
	}

	if (value === 'false') {
		return false;
	}

	return value;
}

export function notMinimist(input: string[]): StructuredArguments {
	const terminatorIndex = input.indexOf('--');
	const parseableInput = terminatorIndex === -1 ? input : input.slice(0, terminatorIndex);
	const passthroughArgs = terminatorIndex === -1 ? [] : input.slice(terminatorIndex + 1);

	const output: StructuredArguments = {
		flags: {},
		args: [],
		passthroughArgs,
	};

	for (let index = 0; index < parseableInput.length; index++) {
		const chunk = parseableInput[index];

		if (chunk.startsWith('-')) {
			const flagContent = chunk.replace(/^--?/, '');
			if (!flagContent) {
				output.args.push(chunk);
				continue;
			}

			const equalsIndex = flagContent.indexOf('=');

			if (equalsIndex !== -1) {
				// Flag with = syntax: --key=value
				const key = flagContent.substring(0, equalsIndex);
				if (!key) {
					output.args.push(chunk);
					continue;
				}

				const value = flagContent.substring(equalsIndex + 1);
				output.flags[key] = castValue(value);
			} else {
				// Flag without = syntax
				const key = flagContent;

				// Look at the next chunk
				if (index + 1 < parseableInput.length && !parseableInput[index + 1].startsWith('-')) {
					// Consume exactly one value token for this flag.
					const value = parseableInput[index + 1];
					output.flags[key] = castValue(value);
					index++;
				} else {
					// No value provided, set to true
					output.flags[key] = true;
				}
			}
		} else {
			output.args.push(chunk);
		}
	}

	return output;
}
