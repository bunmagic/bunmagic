import {CLI} from 'bunmagic/extras';
/**
 * Run a shell command and return the result as text,
 * even if it's an error.
 */
export async function $get(...properties: Parameters<typeof $>) {
	const result = await $(...properties).quiet();
	if (result.stdout.length > 0) {
		return result.stdout.toString();
	}

	return result.stderr.toString();
}

function selectionFrame(selected: number, selectionQuestion: string, options: string[]) {
	const output: string[] = [`> ${ansis.bold(selectionQuestion)}`];
	for (const [index, opt] of options.entries()) {
		const prefix = index === selected ? '→ ' : '  ';
		const line = `${prefix} ${ansis.bold(`${index + 1}`)}:  ${opt} `;
		output.push(line);
	}

	return output.join('\n');
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


export async function selection<T extends string>(options: T[], selectionQuestion: string): Promise<T> {
	let selectedIndex = 0;
	let frame = selectionFrame(selectedIndex, selectionQuestion, options);

	await CLI.raw(true);
	await CLI.hideCursor();
	await CLI.stdout(frame);

	for await (const chunk of Bun.stdin.stream()) {
		const key = interpretKey(chunk as Uint8Array);

		if (!key) {
			continue;
		}

		if (key === 'return') {
			break;
		}

		if (key === 'interrupt') {
			throw new Exit('User interrupted');
		}

		if (key === 'escape') {
			throw new Error('User cancelled selection');
		}

		if (key === 'up') {
			selectedIndex = (selectedIndex - 1 < 0) ? options.length - 1 : selectedIndex - 1;
		}

		if (key === 'down') {
			selectedIndex = (selectedIndex + 1 >= options.length) ? 0 : selectedIndex + 1;
		}

		if (typeof key === 'number' && key > 0 && key <= options.length) {
			selectedIndex = key - 1;
		}

		await CLI.clearFrame(frame);
		frame = selectionFrame(selectedIndex, selectionQuestion, options);
		await CLI.stdout(frame);
	}

	await CLI.clearFrame(frame, true);
	await CLI.raw(false);
	await CLI.showCursor();

	return options[selectedIndex];
}

export function cd(path: string) {
	if (path.startsWith('~')) {
		path = $HOME + path.slice(1);
	}

	$.cwd(path);
}

export function ack(q: string, defaultAnswer: 'y' | 'n' = 'y') {
	let yesOrNo = '[y/N]';
	if (defaultAnswer === 'y') {
		yesOrNo = '[Y/n]';
	}

	let answer = prompt(`${q} ${yesOrNo} `);

	answer ||= defaultAnswer;

	return answer.toLowerCase() === 'y';
}

export class Exit extends Error {
	constructor(error?: unknown) {
		super();
		if (argv.debug) {
			console.error(error);
		}

		if (error === 0) {
			this.exit(0);
		}

		if (!error) {
			console.warn('Exiting without error.');
			this.exit(1);
		}

		const message = error instanceof Error ? error.message : error;
		console.log(`\n${ansis.red.bold('(!)')}`, message);

		this.exit(1);
	}

	private exit(code: number) {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(code);
	}
}


export const sleep = async (ms: number) => new Promise(resolve => {
	setTimeout(resolve, ms);
});
