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

	let seenFlag = false;

	for (let index = 0; index < input.length; index++) {
		const chunk = input[index];

		if (chunk.startsWith('-')) {
			// This is a flag
			seenFlag = true;
			const flagContent = chunk.replace(/^--?/, '');
			const equalsIndex = flagContent.indexOf('=');

			if (equalsIndex !== -1) {
				// Flag with = syntax: --key=value
				const key = flagContent.substring(0, equalsIndex);
				let value = flagContent.substring(equalsIndex + 1);

				// Look ahead to see if we should concatenate more values
				let lookAheadIndex = index + 1;
				while (lookAheadIndex < input.length && !input[lookAheadIndex].startsWith('-')) {
					value += ` ${input[lookAheadIndex]}`;
					lookAheadIndex++;
				}

				output.flags[key] = castValue(value);
				index = lookAheadIndex - 1; // Skip the concatenated values
			} else {
				// Flag without = syntax
				const key = flagContent;

				// Look at the next chunk
				if (index + 1 < input.length && !input[index + 1].startsWith('-')) {
					// The next chunk is a value for this flag
					let value = input[index + 1];
					index++; // Skip the value we just consumed

					// Continue concatenating non-flag values
					let lookAheadIndex = index + 1;
					while (lookAheadIndex < input.length && !input[lookAheadIndex].startsWith('-')) {
						value += ` ${input[lookAheadIndex]}`;
						lookAheadIndex++;
					}

					output.flags[key] = castValue(value);
					index = lookAheadIndex - 1; // Skip the concatenated values
				} else {
					// No value provided, set to true
					output.flags[key] = true;
				}
			}
		} else {
			// This is not a flag
			if (!seenFlag) {
				// We haven't seen any flags yet, so this is a positional argument
				output.args.push(chunk);
			} else {
				// We've seen flags, but this isn't handled by a flag, so it's an arg
				// This case shouldn't happen based on our logic above, but just in case
				output.args.push(chunk);
			}
		}
	}

	return output;
}
