/* eslint-disable @typescript-eslint/prefer-readonly */
import {$} from 'bun';
import ansis from 'ansis';

class Spinner {
	static instances: Spinner[] = [];
	private linesRendered = 0;
	private animationIndex = 0;
	private label: string | undefined;
	private interval: ReturnType<typeof setInterval> | undefined;
	private animation = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(s => ansis.dim(s));
	constructor() {
		Spinner.instances.push(this);
	}

	async stdout(s: string) {
		return Bun.write(Bun.stdout, s);
	}

	async moveUp(count = 1) {
		await this.stdout(`\u001B[${count}A`);
	}

	async clearLines(count = 1) {
		await this.moveUp(count);
		await this.stdout('\u001B[2K'.repeat(count));
	}

	public setLabel = (text: string) => {
		this.label = text;
	};

	async update() {
		const {linesRendered, animationIndex, label} = this;

		if (linesRendered !== 0) {
			await this.clearLines();
		}

		await this.stdout('\r');
		await this.stdout(`${this.animation[animationIndex]} ${label || ''}`);
		this.animationIndex = (animationIndex + 1) % this.animation.length;
	}

	async hideCursor() {
		await this.stdout('\u001B[?25l');
	}

	async showCursor() {
		await this.stdout('\u001B[?25h');
	}

	async start() {
		await this.hideCursor();
		this.interval = setInterval(async () => {
			await this.update();
		}, 120);
	}

	async stop() {
		clearInterval(this.interval);
		await this.stdout('\r');
		const lineLength = this.animation.length + (this.label?.length || 0) + 1;
		await this.stdout(' '.repeat(lineLength));
		await this.stdout('\r');
		await this.showCursor();
	}
}

const _console = console;
function disableOutput(setLabel: (text: string) => void) {
	const consoleProxy = new Proxy(console, {
		get(_, property) {
			const colors: Record<string, string> = {
				info: 'cyan',
				warn: 'yellow',
				error: 'red',
			};
			return (data: unknown) => {
				if (
					typeof data === 'string'
					&& typeof property === 'string'
				) {
					let text = data;
					if (property in colors) {
						const color = colors[property];
						if (
							colors[property] in ansis
							&& color in ansis
							&& typeof ansis[color as keyof typeof ansis] === 'function'
						) {
							const colorFunction = ansis[color as keyof typeof ansis] as (text: string) => string;
							text = colorFunction(data);
						}
					}

					setLabel(text);
				}
			};
		},
	});
	Reflect.set(globalThis, 'console', consoleProxy);
}

function enableOutput() {
	Reflect.set(globalThis, 'console', _console);
}


// eslint-disable-next-line @typescript-eslint/promise-function-async
const $quiet = (...properties: Parameters<typeof $>) => $(...properties).quiet();

type Callback<T> = ($: typeof $quiet) => Promise<T>;

export async function $spinner<T>(callback: Callback<T>, replaceConsole: boolean): Promise<T>;
export async function $spinner<T>(label: string, callback: Callback<T>, replaceConsole: boolean): Promise<T>;
export async function $spinner<T>(...arguments_: unknown[]): Promise<T> {
	let callback: Callback<T>;
	const spinner = new Spinner();
	disableOutput(spinner.setLabel);

	if (typeof arguments_[0] === 'string') {
		spinner.setLabel(arguments_[0]);
		callback = arguments_[1] as Callback<T>;
	} else {
		callback = arguments_[0] as Callback<T>;
	}

	try {
		await spinner.start();
		const result: T = await callback($quiet);
		return result;
	} catch (error) {
		throw error;
	} finally {
		await spinner.stop();
		enableOutput();
	}
}
