import { warnDeprecationOnce } from '../lib/deprecations';

const DIE_DEPRECATION_KEY = 'die';
const DIE_DEPRECATION_MESSAGE =
	'[bunmagic] die() is deprecated and will be removed in v2.0.0. Use `throw new Exit(...)` instead.';

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
	constructor(error?: unknown) {
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

		if (typeof error === 'object' && error !== null && 'stdout' in error && 'stderr' in error) {
			// This is likely a Bun shell output object
			// eslint-disable-next-line @typescript-eslint/ban-types
			const { stdout, stderr } = error as { stdout: Buffer; stderr: Buffer };

			if (stdout.length > 0) {
				console.log(`\n ${ansis.yellow.bold('»')} Command ${ansis.bold('stdout')}:`);
				console.log(ansis.dim(this.indent(stdout.toString().trim())));
			}

			if (stderr.length > 0) {
				console.log(`\n ${ansis.red.bold('»')} Command ${ansis.bold('stderr')}:`);
				console.log(ansis.dim(this.indent(stderr.toString().trim())));
			}
		}

		const message = error instanceof Error ? error.message : error;
		console.log(
			`\n ${ansis.yellow.bold('»')}`,
			typeof message === 'string' ? ansis.yellow(message) : message,
		);

		this.exit(1);
	}

	private indent(text: string) {
		return text
			.split('\n')
			.map(line => `  ${line}`)
			.join('\n');
	}

	private exit(code: number) {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(code);
	}
}

/**
 * @deprecated `die()` is deprecated and will be removed in v2.0.0. Use `throw new Exit(...)` instead.
 */
export function die(output: unknown) {
	warnDeprecationOnce(DIE_DEPRECATION_KEY, DIE_DEPRECATION_MESSAGE);
	throw new Exit(output);
}

export const sleep = async (ms: number) => Bun.sleep(ms);
