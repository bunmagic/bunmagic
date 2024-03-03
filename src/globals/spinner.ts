import { CLI } from 'bunmagic/extras';
import { $ } from 'bun';
import ansis from 'ansis';

class Spinner {
	private static spinners: Spinner[] = [];
	private static linesRendered = 0;
	private static interval: ReturnType<typeof setInterval> | undefined;
	private static readonly consoleRef = console;

	private static async tick() {
		const lines: string[] = [];

		for (const spinner of Spinner.spinners) {
			lines.push(await spinner.frame());
		}

		if (Spinner.linesRendered !== 0) {
			await CLI.clearLines(Spinner.linesRendered);
		}

		for (const line of lines) {
			await CLI.stdout(`${line}\n`);
		}

		Spinner.linesRendered = lines.map(line => line.split('\n').length).reduce((a, b) => a + b, 0);
	}

	private static disableConsole() {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const noop = () => {};
		Reflect.set(globalThis, 'console', new Proxy(console, {
			get() {
				return noop;
			},
		}));
	}

	private static enableConsole() {
		Reflect.set(globalThis, 'console', Spinner.consoleRef);
	}

	private static async onFirstStart() {
		Spinner.interval ||= setInterval(async () => {
			await Spinner.tick();
		}, 120);
		Spinner.disableConsole();
		await CLI.hideCursor();
	}

	private static async onFinalStop(frame: string) {
		await Spinner.tick();
		await CLI.stdout('\r');
		await CLI.stdout(' '.repeat(frame.length));
		await CLI.stdout('\r');

		// Move the cursor up if the previous frame was completely empty.
		// (this happens when not using a label with spinner)
		if (frame.length === 0) {
			await CLI.clearFrame(frame, true);
		}

		await CLI.showCursor();
		Spinner.enableConsole();

		clearInterval(Spinner.interval);
		Spinner.interval = undefined;
		Spinner.linesRendered = 0;
		Spinner.spinners = [];
	}

	private status: 'inactive' | 'running' | 'success' | 'error' = 'inactive';
	private animationIndex = 0;
	private label: string | undefined;
	private readonly animation = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(s => ansis.dim(s));
	private error: Error | undefined;


	public setLabel = (text: string) => {
		this.label = text;
	};

	async frame() {
		let flag = ' ';
		let output = '';

		if (this.status === 'running') {
			this.animationIndex = (this.animationIndex + 1) % this.animation.length;
			flag = this.animation[this.animationIndex];
		}

		if (this.status === 'success') {
			flag = ansis.green('✔');
		}

		if (this.status === 'error') {
			flag = ansis.red('✖');
		}

		// Only show the flag if there's a label or the spinner is running
		if (this.label && this.label.trim() !== '') {
			output = `${flag} ${this.label || ''}`;
		} else if (this.status === 'running') {
			output = flag;
		}

		// Show the error message
		if (this.error) {
			output += ' ';
			const debugMessage = ansis.dim(' (Use --debug to see the full error stack.)');
			const errorMessage = this.error.message.replace('Error: ', '');
			output += `${ansis.red(errorMessage)}${argv.debug ? '' : debugMessage}`;
			if (argv.debug && this.error.stack) {
				const padSize = this.label?.length ? this.label.length + 3 : 0;
				const padding = ' '.repeat(padSize);
				const paddedStack = this.error.stack.split('\n').map(line => `${padding}${line.trim()}`).join('\n');
				output += ansis.dim(`\n${paddedStack}`);
			}
		}

		return output.trim();
	}

	async start() {
		if (Spinner.spinners.length === 0) {
			await Spinner.onFirstStart();
		}

		Spinner.spinners.push(this);
		this.status = 'running';
	}

	async stop() {
		if (this.status === 'running') {
			this.status = 'inactive';
		}

		if (Spinner.spinners.filter(spinner => spinner.status === 'running').length === 0) {
			const frame = await this.frame();
			await Spinner.onFinalStop(frame);
		}
	}

	public setError(error: unknown) {
		if (error instanceof Error) {
			this.error = error;
		}

		this.error = new Error(String(error));
	}

	public setStatus(status: 'success' | 'error') {
		this.status = status;
	}
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
const $quiet = (...properties: Parameters<typeof $>) => $(...properties).quiet();

type Callback<T> = ($: typeof $quiet, setLabel: Spinner['setLabel']) => Promise<T>;

export async function $spinner<T>(callback: Callback<T>, replaceConsole: boolean): Promise<T>;
export async function $spinner<T>(label: string, callback: Callback<T>, replaceConsole: boolean): Promise<T>;
export async function $spinner<T>(...arguments_: unknown[]): Promise<T> {
	let callback: Callback<T>;
	const spinner = new Spinner();

	if (typeof arguments_[0] === 'string') {
		spinner.setLabel(arguments_[0]);
		callback = arguments_[1] as Callback<T>;
	} else {
		callback = arguments_[0] as Callback<T>;
	}

	try {
		await spinner.start();
		const result: T = await callback($quiet, spinner.setLabel);
		spinner.setStatus('success');
		return result;
	} catch (error) {
		spinner.setStatus('error');
		spinner.setError(error);
		throw error;
	} finally {
		await spinner.stop();
	}
}
