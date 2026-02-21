/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
type StructuredArguments = {
	flags: Record<string, string | number | boolean | undefined>;
	args: string[];
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
	const output: StructuredArguments = {
		flags: {},
		args: [],
	};

	for (let index = 0; index < input.length; index++) {
		const chunk = input[index];

		if (chunk.startsWith('-')) {
			const flagContent = chunk.replace(/^--?/, '');
			const equalsIndex = flagContent.indexOf('=');

			if (equalsIndex !== -1) {
				// Flag with = syntax: --key=value
				const key = flagContent.substring(0, equalsIndex);
				const value = flagContent.substring(equalsIndex + 1);
				output.flags[key] = castValue(value);
			} else {
				// Flag without = syntax
				const key = flagContent;

				// Look at the next chunk
				if (index + 1 < input.length && !input[index + 1].startsWith('-')) {
					// Consume exactly one value token for this flag.
					const value = input[index + 1];
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
