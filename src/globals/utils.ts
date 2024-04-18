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


export const sleep = async (ms: number) => new Promise(resolve => {
	setTimeout(resolve, ms);
});
