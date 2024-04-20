import { CLI } from 'bunmagic/extras';

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

export function cliMarkdown(input: string) {
	input = input.replace(/\*\*(.*?)\*\*/g, (_, match) => ansis.bold(match));
	input = input.replace(/__(.*?)__/g, (_, match) => ansis.dim(match));
	return input;
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

export function ask(q: string, defaultAnswer: string = ''): string {
	const question = `${ansis.dim('▷ ')}${cliMarkdown(q)}`;
	console.log(question);
	const result = prompt(ansis.yellowBright('…')) ?? defaultAnswer;
	CLI.moveUp(1);
	CLI.clearLines(2);
	CLI.moveDown(1);

	const displayAnswer = result ? ansis.green(result) : ansis.dim.italic('\'\'');
	console.log(ansis.dim(question.replace('▷', '▶︎')) + ansis.dim(': ') + displayAnswer);
	return result;
}

export class Exit extends Error {
	constructor (error?: unknown) {
		super();
		if (flags.debug) {
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
		console.log(`\n ${ansis.yellow.bold('»')}`, typeof message === 'string' ? ansis.yellow(message) : message);

		this.exit(1);
	}

	private exit(code: number) {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(code);
	}
}


export const sleep = async (ms: number) => {
	return Bun.sleep(ms);
}
