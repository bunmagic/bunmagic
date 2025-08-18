import { CLI } from '../extras';

type Option<T extends string> = {
	label: string;
	value: T;
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
	// "Right Arrow" (ESC [ C)
	'\u001B[C': 'right',
	// "Left Arrow" (ESC [ D)
	'\u001B[D': 'left',
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
	// Home (ESC [ H or ESC [ 1 ~)
	'\u001B[H': 'home',
	'\u001B[1~': 'home',
	// End (ESC [ F or ESC [ 4 ~)
	'\u001B[F': 'end',
	'\u001B[4~': 'end',
	// Ctrl+A (Start of line)
	'\u0001': 'home',
	// Ctrl+E (End of line)
	'\u0005': 'end',
	// Ctrl+W (Delete word backwards)
	'\u0017': 'delete-word-backward',
	// Alt+Left (ESC b - word backward)
	'\u001Bb': 'word-backward',
	// Alt+Right (ESC f - word forward)
	'\u001Bf': 'word-forward',
	// Alt+Backspace (ESC DEL)
	'\u001B\u007F': 'delete-word-backward',
	// Alt+Delete (ESC [ 3 ~)
	'\u001B\u001B[3~': 'delete-word-forward',
	// Alt+d (delete word forward)
	'\u001Bd': 'delete-word-forward',
	// Space
	' ': ' ',
};

function interpretKey(utfSequence: Uint8Array): string | number | false | { key: string } {
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

	if (/^[\p{L}\p{N}\p{Emoji}\p{Punctuation}\p{Symbol}\s]+$/u.test(sequence)) {
		return sequence;
	}

	return false;
}

function renderFrame(selectionQuestion: string, options: Option<string>[], query: string) {
	const totalOptionsCount = options.length;
	const output: string[] = [`> ${ansis.bold(selectionQuestion)}`];

	// Filter and process options based on fuzzy search
	const filteredOptions = options.map((option, index) => {
		const prefix = option.selected ? ansis.greenBright(' ⦿') : ansis.dim(' ⦾');
		let label = option.label;
		if (query.length > 0) {
			label = '';
			for (const letter of option.label) {
				label += option.matches.includes(option.label.indexOf(letter))
					? ansis.bold(letter)
					: letter;
			}

			if (query.length > 0 && !option.visible) {
				label = ansis.dim(label);
			}
		}

		const number = ansis.dim.gray(`[${index + 1}]`);
		const line = `${number}${prefix} ${label} `;

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
	const matches = options.map(option =>
		fuzzyMatch(option.label.toLowerCase(), query.toLowerCase()),
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
	options: T[] | { value: T; label: string }[],
): Promise<T> {
	let query = ''; // Start with an empty query
	const _options: Option<T>[] = options.map(text => ({
		label: typeof text === 'string' ? text : text.label,
		value: typeof text === 'string' ? text : text.value,
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
		if (input === false) {
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
				const previousSelected = _options.findIndex(option => option.selected);
				const selected = previousSelected - 1 < 0 ? _options.length - 1 : previousSelected - 1;
				_options[previousSelected].selected = false;
				_options[selected].selected = true;
			}

			if (input.key === 'down') {
				const previousSelected = _options.findIndex(option => option.selected);
				const selected = (previousSelected + 1) % _options.length;
				_options[previousSelected].selected = false;
				_options[selected].selected = true;
			}

			if (input.key === 'backspace' || input.key === 'delete') {
				query = query.slice(0, -1);
				await searchOptions(query, _options);
			}
		} else if (typeof input === 'number' && input > 0 && input <= _options.length) {
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
	const defaultOption = _options[0].value;
	return selected === -1 ? defaultOption : _options[selected].value;
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
		if (input === false) {
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

			if ((input.key === 'backspace' || input.key === 'delete') && password.length > 0) {
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

function findWordBoundary(text: string, pos: number, direction: 'left' | 'right'): number {
	if (direction === 'left') {
		if (pos === 0) return 0;
		let newPos = pos - 1;
		// Skip spaces
		while (newPos > 0 && text[newPos] === ' ') newPos--;
		// Skip non-spaces
		while (newPos > 0 && text[newPos - 1] !== ' ') newPos--;
		return newPos;
	} else {
		if (pos === text.length) return text.length;
		let newPos = pos;
		// Skip non-spaces
		while (newPos < text.length && text[newPos] !== ' ') newPos++;
		// Skip spaces
		while (newPos < text.length && text[newPos] === ' ') newPos++;
		return newPos;
	}
}

type HandleAskResponse =
	| 'required'
	| 'use_default'
	| ((answer: string | undefined) => Promise<string>);
export async function ask(
	q: string,
	defaultAnswer = '',
	handle: HandleAskResponse = 'use_default',
): Promise<string> {
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
	const display = (text: string) => text || "''";
	const columns = process.stdout.columns;

	const stream = CLI.stream();
	let answer = '';
	let cursorPosition = 0;
	stream.start();
	console.log(ansis.yellow('»') + ansis.reset(` ${q}: `));

	const defaultValue = ansis.dim.italic(`${display(defaultAnswer)}`);
	const inputFlag = ansis.yellowBright('…');
	const inputPrompt = `${inputFlag} ${defaultValue} ${'\b'.repeat(ansis.strip(defaultValue).length)}`;

	await CLI.stdout(inputPrompt);
	await CLI.hideCursor();

	// Helper to render the current input state
	const renderInput = async () => {
		await CLI.clearLine();
		const displayText = display(answer);
		await CLI.stdout(`${inputFlag} ${displayText}`);
		// Move cursor to correct position
		if (cursorPosition < answer.length) {
			const moveBack = ansis.strip(displayText).length - cursorPosition;
			if (moveBack > 0) {
				await CLI.moveLeft(moveBack);
			}
		}
		await CLI.showCursor();
	};

	for await (const chunk of stream.start()) {
		const input = interpretKey(chunk);
		if (input === false) {
			continue;
		}

		if (typeof input === 'object') {
			if (input.key === 'return') {
				try {
					const result = await handle(answer);
					const displayAnswer = result ? ansis.green(result) : ansis.dim.greenBright("''");
					// On success: clear current line in case the next print is shorter than the current one
					await CLI.clearLine();

					// Also clear & replace line above
					await CLI.moveUp(1);
					await CLI.replaceLine(
						ansis.green('✔︎'),
						ansis.dim(`${q}:`),
						ansis.dim('"') + displayAnswer + ansis.dim('"'),
					);

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
					cursorPosition = 0;
				}
			}

			if (input.key === 'interrupt') {
				await CLI.moveUp(1);
				await CLI.replaceLine(ansis.dim(`» ${q}: Canceled`));
				await CLI.showCursor();
				throw new Exit(0);
			}

			// Cursor navigation
			if (input.key === 'left' && cursorPosition > 0) {
				cursorPosition--;
				await CLI.moveLeft(1);
				continue;
			}

			if (input.key === 'right' && cursorPosition < answer.length) {
				cursorPosition++;
				await CLI.moveRight(1);
				continue;
			}

			if (input.key === 'home') {
				if (cursorPosition > 0) {
					await CLI.moveLeft(cursorPosition);
					cursorPosition = 0;
				}
				continue;
			}

			if (input.key === 'end') {
				if (cursorPosition < answer.length) {
					await CLI.moveRight(answer.length - cursorPosition);
					cursorPosition = answer.length;
				}
				continue;
			}

			// Word navigation
			if (input.key === 'word-backward') {
				const newPos = findWordBoundary(answer, cursorPosition, 'left');
				if (newPos < cursorPosition) {
					await CLI.moveLeft(cursorPosition - newPos);
					cursorPosition = newPos;
				}
				continue;
			}

			if (input.key === 'word-forward') {
				const newPos = findWordBoundary(answer, cursorPosition, 'right');
				if (newPos > cursorPosition) {
					await CLI.moveRight(newPos - cursorPosition);
					cursorPosition = newPos;
				}
				continue;
			}

			// Deletion operations
			if (input.key === 'delete-word-backward' && cursorPosition > 0) {
				const newPos = findWordBoundary(answer, cursorPosition, 'left');
				answer = answer.slice(0, newPos) + answer.slice(cursorPosition);
				cursorPosition = newPos;
				await renderInput();
				continue;
			}

			if (input.key === 'delete-word-forward' && cursorPosition < answer.length) {
				const newPos = findWordBoundary(answer, cursorPosition, 'right');
				answer = answer.slice(0, cursorPosition) + answer.slice(newPos);
				await renderInput();
				continue;
			}

			if (input.key === 'backspace' && cursorPosition > 0) {
				answer = answer.slice(0, cursorPosition - 1) + answer.slice(cursorPosition);
				cursorPosition--;
				if (answer === '') {
					await CLI.clearLine();
					await CLI.hideCursor();
					await CLI.stdout(inputPrompt);
				} else {
					await renderInput();
				}
				continue;
			}

			if (input.key === 'delete' && cursorPosition < answer.length) {
				answer = answer.slice(0, cursorPosition) + answer.slice(cursorPosition + 1);
				await renderInput();
				continue;
			}

			// Space handling
			if (input.key === ' ') {
				answer = answer.slice(0, cursorPosition) + ' ' + answer.slice(cursorPosition);
				cursorPosition++;
				await renderInput();
				continue;
			}
		} else if (typeof input === 'number' || typeof input === 'string') {
			// Insert character at cursor position
			const inputStr = `${input}`;
			answer = answer.slice(0, cursorPosition) + inputStr + answer.slice(cursorPosition);
			cursorPosition += inputStr.length;
			await renderInput();
		}
	}

	return answer;
}
