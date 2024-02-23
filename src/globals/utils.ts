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

export function selection<T extends string>(options: T[], selectionQuestion: string): T {
	for (const [index, opt] of options.entries()) {
		console.log(`> ${ansis.bold(`${index + 1}`)}:  ${opt} `);
	}

	const result = prompt(selectionQuestion + '(default: 1): \n');
	const selected = result ? Number.parseInt(result, 10) : 1;
	return options[selected - 1];
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
