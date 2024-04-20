import { CLI } from '../extras';

type Option<T extends string> = {
	text: T;
	visible: boolean;
	selected: boolean;
	matches: number[];
};

function fuzzyMatch(text: string, query: string): number[] {
	let queryIndex = 0; // Current index in the query string
	const matchIndexes: number[] = []; // Stores indexes where matches occur
	for (
		let index = 0;
		index < text.length && queryIndex < query.length;
		index++
	) {
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

function interpretKey(
	utfSequence: Uint8Array,
): string | number | false | { key: string } {
	const sequence = String.fromCodePoint(...utfSequence);
	if (sequence in utfKeyMap) {
		return { key: utfKeyMap[sequence] };
	}

	if (/^\d+$/.test(sequence)) {
		const value = Number(sequence);
		if (!Number.isNaN(value) && Number.isSafeInteger(value)) {
			return value;
		}
	}

	if (/^[\p{L}\p{N}\p{Emoji}\p{Punctuation}\p{Symbol}]+$/u.test(sequence)) {
		return sequence;
	}

	return false;
}

function renderFrame(
	selectionQuestion: string,
	options: Option<string>[],
	query: string,
) {
	const totalOptionsCount = options.length;
	const output: string[] = [`> ${ansis.bold(selectionQuestion)}`];

	// Filter and process options based on fuzzy search
	const filteredOptions = options.map((option, index) => {
		const prefix = option.selected ? ansis.greenBright(' ⦿') : ansis.dim(' ⦾');
		let text = option.text;
		if (query.length > 0) {
			text = '';
			for (const letter of option.text) {
				text += option.matches.includes(option.text.indexOf(letter))
					? ansis.bold(letter)
					: letter;
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

async function searchOptions<T extends string>(
	query: string,
	options: Array<Option<T>>,
) {
	const matches = options.map(option =>
		fuzzyMatch(option.text.toLowerCase(), query.toLowerCase()),
	);
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

export async function select<T extends string>(
	message: string,
	options: T[],
): Promise<T> {
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
		const input = interpretKey(chunk);
		if (!input) {
			continue;
		}

		if (typeof input === 'object') {
			if (input.key === 'return') {
				break;
			}

			if (input.key === 'interrupt') {
				await CLI.clearFrame(frame, true);
				await CLI.showCursor();
				throw new Exit('User interrupted');
			}

			if (input.key === 'escape') {
				await CLI.clearFrame(frame, true);
				await CLI.showCursor();
				throw new Error('User cancelled selection');
			}

			if (input.key === 'up') {
				const previousSelected = _options.findIndex(
					option => option.selected,
				);
				const selected = previousSelected - 1 < 0 ? _options.length - 1 : previousSelected - 1;
				_options[previousSelected].selected = false;
				_options[selected].selected = true;
			}

			if (input.key === 'down') {
				const previousSelected = _options.findIndex(
					option => option.selected,
				);
				const selected = (previousSelected + 1) % _options.length;
				_options[previousSelected].selected = false;
				_options[selected].selected = true;
			}

			if (input.key === 'backspace' || input.key === 'delete') {
				query = query.slice(0, -1);
				await searchOptions(query, _options);
			}
		} else if (
			typeof input === 'number' &&
			input > 0 &&
			input <= _options.length
		) {
			const index = input - 1;
			if (_options[index]) {
				for (const option of _options) {
					option.selected = false;
				}

				_options[index].selected = true;
			}
		} else if (typeof input === 'string' && input.length === 1) {
			query += input;
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

export async function autoselect<T extends string>(
	message: string,
	options: T[],
	flag: string,
): Promise<T> {
	// Override the selection if the flag is set
	if (flags && flag in flags && flags[flag]) {
		return flags[flag] as T;
	}

	if (options.length === 1) {
		return options[0];
	}

	return select(message, options);
}

export async function getPassword(message: string): Promise<string> {
	let password = '';

	const stream = CLI.stream();
	await CLI.stdout(`${message}`);
	for await (const chunk of stream.start()) {
		const input = interpretKey(chunk);
		if (!input) {
			continue;
		}

		if (typeof input === 'object') {
			if (input.key === 'return') {
				break;
			}

			if (input.key === 'interrupt') {
				await CLI.showCursor();
				throw new Error('User interrupted');
			}

			if (
				(input.key === 'backspace' || input.key === 'delete') &&
				password.length > 0
			) {
				await CLI.stdout('\b \b');
				password = password.slice(0, -1);
			}
		} else if (typeof input === 'number') {
			await CLI.stdout('*');
			password += `${input}`;
		} else if (typeof input === 'string') {
			await CLI.stdout('*'.repeat(input.length));
			password += input;
		}
	}

	stream.stop();
	return password;
}


function cliMarkdown(input: string) {
	input = input.replaceAll(/\*\*(.*?)\*\*/g, (_, match: string) => ansis.bold(match));
	input = input.replaceAll(/__(.*?)__/g, (_, match: string) => ansis.dim(match));
	return input;
}

type HandleAskResponse = 'required' | 'use_default' | ((answer: string | undefined) => Promise<string>);
export async function ask(q: string, defaultAnswer = '', handle: HandleAskResponse = 'use_default'): Promise<string> {
	if (handle === 'required') {
		handle = async answer => {
			if (!answer?.trim()) {
				throw new Error('Non-empty string required.');
			}

			return answer;
		};
	}

	if (handle === 'use_default') {
		handle = async answer => answer ?? defaultAnswer;
	}

	q = cliMarkdown(q);
	const display = (text: string) => text || '\'\'';

	const stream = CLI.stream();
	let answer = '';
	stream.start();
	console.log(ansis.yellow('»') + ansis.reset(` ${q}: `));

	const defaultValue = ansis.dim.italic(`${display(defaultAnswer)}`);
	const inputFlag = ansis.yellowBright('…');
	const inputPrompt = `${inputFlag} ${defaultValue} ${'\b'.repeat(ansis.strip(defaultValue).length)}`;

	await CLI.stdout(inputPrompt);
	await CLI.hideCursor();


	for await (const chunk of stream.start()) {
		const input = interpretKey(chunk);
		if (!input) {
			continue;
		}

		if (typeof input === 'object') {
			if (input.key === 'return') {
				try {
					const result = await handle(answer);
					const displayAnswer = result ? ansis.green(result) : ansis.dim.greenBright('\'\'');
					await CLI.moveUp(1);
					await CLI.replaceLine(ansis.green('✔︎'), ansis.dim(q + ':'), ansis.dim('"') + displayAnswer + ansis.dim('"'));
					await CLI.showCursor();
					break;
				} catch (error: unknown) {
					let message = 'Invalid response.';
					// eslint-disable-next-line max-depth
					if (typeof error === 'object' && error !== null && 'message' in error) {
						message = (error as { message: string }).message;
					}

					await CLI.moveUp(1);
					await CLI.replaceLine(ansis.red('✖'), q, ansis.yellow(message));
					await CLI.moveDown();
					await CLI.stdout(inputPrompt);
					await CLI.hideCursor();
					await CLI.moveLeft(answer.length);
					answer = '';
				}
			}

			if (input.key === 'interrupt') {
				await CLI.moveUp(1);
				await CLI.replaceLine(ansis.dim(`» ${q}: Canceled`));
				await CLI.showCursor();
				throw new Exit(0);
			}

			if (
				(input.key === 'backspace' || input.key === 'delete') &&
				answer.length > 0
			) {
				await CLI.showCursor();
				await CLI.stdout('\b \b');
				answer = answer.slice(0, -1);
				if (answer === '') {
					await CLI.clearLine();
					await CLI.hideCursor();
					await CLI.stdout(inputPrompt);
				}
			}

			if (input.key === ' ') {
				answer += ' ';
				await CLI.showCursor();
				await CLI.clearLine();
				await CLI.stdout(`${ansis.yellowBright('…')} ${display(answer)}`);
			}
		} else if (typeof input === 'number' || typeof input === 'string') {
			answer += `${input}`;
			await CLI.showCursor();
			await CLI.clearLine();
			await CLI.stdout(`${ansis.yellowBright('…')} ${display(answer)}`);
		}
	}

	return answer;
}
