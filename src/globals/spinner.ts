/* eslint-disable @typescript-eslint/prefer-readonly */
import {$} from 'bun';
import ansis from 'ansis';

class Spinner {
	static active: Spinner[] = [];
	private linesRendered = 0;
	private animationIndex = 0;
	private label: string | undefined;
	private interval: ReturnType<typeof setInterval> | undefined;
	private animation = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(s => ansis.dim(s));
	private consoleRef = console;

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
		Spinner.active.push(this);
		this.disableConsole();
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

		if (Spinner.active.length === 1) {
			await this.showCursor();
			this.enableConsole();
		}

		// Remove this instance from the active list
		Spinner.active = Spinner.active.filter(instance => instance !== this);
	}

	disableConsole() {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const noop = () => {};
		Reflect.set(globalThis, 'console', new Proxy(console, {
			get() {
				return noop;
			},
		}));
	}

	enableConsole() {
		Reflect.set(globalThis, 'console', this.consoleRef);
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
		return result;
	} catch (error) {
		throw error;
	} finally {
		await spinner.stop();
	}
}
