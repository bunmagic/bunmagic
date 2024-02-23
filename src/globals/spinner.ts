import {$} from 'bun';
import ansis from 'ansis';

// Define nice progress dots as spinner states
const spinnerStates = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(s => ansis.dim(s));

let label: string | undefined;
let currentIndex = 0;

async function stdout(string_: string) {
	return Bun.write(Bun.stdout, string_);
}

// Spinner update function
async function updateSpinner() {
	await stdout('\r');
	await stdout(`${spinnerStates[currentIndex]} ${label || ''}`);
	currentIndex = (currentIndex + 1) % spinnerStates.length;
}

const _console = console;
function disableOutput() {
	const consoleProxy = new Proxy(console, {
		get(_, property) {
			const colors = {
				info: 'cyan',
				warn: 'yellow',
				error: 'red',
			} as const;
			return (data: unknown) => {
				if (typeof data === 'string') {
					if (property in colors) {
						data = ansis[colors[property]](data);
					}

					label = data;
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

export async function $spinner<T>(callback: Callback<T>): Promise<T>;
export async function $spinner<T>(label: string, callback: Callback<T>): Promise<T>;
export async function $spinner<T>(...arguments_: unknown[]): Promise<T> {
	let callback: Callback<T>;

	disableOutput();

	if (typeof arguments_[0] === 'string') {
		label = arguments_[0];
		callback = arguments_[1] as Callback<T>;
	} else {
		callback = arguments_[0] as Callback<T>;
	}

	// Start the spinner
	const spinnerInterval = setInterval(async () => {
		await updateSpinner();
	}, 120);

	try {
		// Hide the cursor
		await stdout('\u001B[?25l');
		// Execute the callback function
		const result: T = await callback($quiet);

		// Return the result after clearing the spinner
		clearInterval(spinnerInterval);
		await stdout('\r');
		await stdout(' '.repeat(spinnerStates.length + (label?.length || 0) + 1)); // Clear the spinner line
		await stdout('\r');
		return result;
	} catch (error) {
		// In case of an error, clear the spinner and rethrow the error
		clearInterval(spinnerInterval);
		await stdout('\r');
		throw error;
	} finally {
		// Show the cursor
		await stdout('\u001B[?25h');
		enableOutput();
	}
}
