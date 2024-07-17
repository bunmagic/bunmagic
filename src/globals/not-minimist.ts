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
		if (!chunk.startsWith('-')) {
			output.args.push(chunk);
			continue;
		}

		const [key, value] = chunk.replace(/^--?/, '').split('=');
		if (value) {
			output.flags[key] = castValue(value);
			continue;
		}

		const chunkAhead = input[index + 1];
		if (chunkAhead && !chunkAhead.startsWith('-')) {
			output.flags[key] = castValue(chunkAhead);
			index++;
			continue;
		}

		output.flags[key] = true;
	}

	return output;
}
