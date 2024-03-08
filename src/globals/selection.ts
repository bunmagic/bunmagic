import { CLI } from 'bunmagic/extras';

type Option<T extends string> = {
	text: T;
	visible: boolean;
	selected: boolean;
	matches: number[];
};

function fuzzyMatch(text: string, query: string): number[] {
	let queryIndex = 0; // Current index in the query string
	const matchIndexes: number[] = []; // Stores indexes where matches occur
	for (let index = 0; index < text.length && queryIndex < query.length; index++) {
		if (text[index] === query[queryIndex]) {
			matchIndexes.push(index); // Store the index of the match
			queryIndex++; // Move to the next character in the query
		}
	}

	// Return the array of indexes if all characters in the query were found, else return an empty array
	return queryIndex === query.length ? matchIndexes : [];
}

const utfKeyMap: Record<string, string> = {
	// "Up Arrow" (ESC [ A)
	'\u001B[A': 'up',
	// "Down Arrow" (ESC [ B)
	'\u001B[B': 'down',
	// "Ctrl+C" (ETX)
	'\u0003': 'interrupt',
	// "Enter" (LF)
	'\u000A': 'return',
	// "Return" (CR)
	'\u000D': 'return',
	// "Escape" (ESC)
	'\u001B': 'escape',
	// Backspace
	'\u007F': 'backspace',
	// Delete
	'\u001B[3~': 'delete',
	// Space
	' ': ' ',
};

function interpretKey(utfSequence: Uint8Array): string | number | false {
	const sequence = String.fromCodePoint(...utfSequence);
	if (sequence in utfKeyMap) {
		return utfKeyMap[sequence];
	}

	if (/^\d$/.test(sequence)) {
		const value = Number(sequence);
		if (!Number.isNaN(value) && Number.isSafeInteger(value)) {
			return value;
		}
	}

	if (sequence.length === 1 && /^[a-zA-Z]$/.test(sequence)) {
		return sequence.toLowerCase();
	}

	return false;
}


function renderFrame(selectionQuestion: string, options: Option<string>[], query: string) {
	const totalOptionsCount = options.length;
	const output: string[] = [
		`> ${ansis.bold(selectionQuestion)}`,
	];

	// Filter and process options based on fuzzy search
	const filteredOptions = options
		.map((option, index) => {
			const prefix = option.selected
				? ansis.greenBright(' ⦿')
				: ansis.dim(' ⦾');
			let text = option.text;
			if (query.length > 0) {
				text = '';
				for (const letter of option.text) {
					text += option.matches.includes(option.text.indexOf(letter)) ? ansis.bold(letter) : letter;
				}

				if (query.length > 0 && !option.visible) {
					text = ansis.dim(text);
				}
			}

			const number = ansis.dim.gray(`[${index + 1}]`);
			const line = `${number}${prefix} ${text} `;


			return line;
		});
	output.push(...filteredOptions);

	// Maintain frame vertical length by appending empty lines if necessary
	const emptyLinesNeeded = totalOptionsCount - filteredOptions.length;
	for (let index = 0; index < emptyLinesNeeded; index++) {
		output.push(' ');
	}

	if (query.length > 0) {
		output.push(`${ansis.bold.yellow('    »')} ${ansis.dim.underline(query)}`);
	}

	return output.join('\n');
}

async function searchOptions<T extends string>(query: string, options: Array<Option<T>>) {
	const matches = options.map(option => fuzzyMatch(option.text.toLowerCase(), query.toLowerCase()));
	for (const [index, option] of options.entries()) {
		option.matches = matches[index];
		option.visible = matches[index].length > 0;
	}

	const selected = options.find(option => option.selected);
	if (selected && selected.matches.length === 0) {
		const firstVisible = options.find(option => option.matches.length > 0);
		if (firstVisible) {
			selected.selected = false;
			firstVisible.selected = true;
		}
	}
}

export async function selection<T extends string>(message: string, options: T[]): Promise<T> {
	let query = ''; // Start with an empty query
	const _options: Option<T>[] = options.map(text => ({
		text,
		visible: true,
		selected: false,
		matches: [],
	}));

	_options[0].selected = true;
	let frame = renderFrame(message, _options, query);


	await CLI.raw(true);
	await CLI.hideCursor();
	await CLI.stdout(frame);

	const stream = CLI.stream();
	for await (const chunk of stream.start()) {
		const key = interpretKey(chunk);

		if (!key) {
			continue;
		}

		if (key === 'return') {
			break;
		}

		if (key === 'interrupt') {
			await CLI.clearFrame(frame, true);
			await CLI.showCursor();
			throw new Exit('User interrupted');
		}

		if (key === 'escape') {
			await CLI.clearFrame(frame, true);
			await CLI.showCursor();
			throw new Error('User cancelled selection');
		}

		if (key === 'up') {
			const previousSelected = _options.findIndex(option => option.selected);
			const selected = (previousSelected - 1 < 0) ? _options.length - 1 : previousSelected - 1;
			_options[previousSelected].selected = false;
			_options[selected].selected = true;
		}

		if (key === 'down') {
			const previousSelected = _options.findIndex(option => option.selected);
			const selected = (previousSelected + 1) % _options.length;
			_options[previousSelected].selected = false;
			_options[selected].selected = true;
		}

		if (typeof key === 'number' && key > 0 && key <= _options.length) {
			const index = key - 1;
			if (_options[index]) {
				for (const option of _options) {
					option.selected = false;
				}

				_options[index].selected = true;
			}
		}

		if (key === 'backspace' || key === 'delete') {
			query = query.slice(0, -1);
			await searchOptions(query, _options);
		} else if (typeof key === 'string' && key.length === 1) {
			query += key;
			await searchOptions(query, _options);
		}

		await CLI.clearFrame(frame, true);
		frame = renderFrame(message, _options, query);
		await CLI.stdout(frame);
	}

	stream.stop();
	await CLI.clearFrame(frame, true);
	await CLI.raw(false);
	await CLI.showCursor();

	// Return the selected option in its original form
	// Make sure to filter options by match before determining the selected option
	const selected = _options.findIndex(option => option.selected);
	return selected === -1 ? options[0] : _options[selected].text;
}
