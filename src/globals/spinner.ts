// Define nice progress dots as spinner states
const spinnerStates = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let currentIndex = 0;

async function stdout(string_: string) {
	return Bun.write(Bun.stdout, string_);
}

// Capture console.log outputs
const capturedLogs: string[] = [];

// Temporarily override console.log
const originalConsoleLog = console.log;
const log = (...data: unknown[]) => {
	capturedLogs.push(data.map(d => typeof d === 'object' ? JSON.stringify(d) : d).join(' '));
};

// Spinner update function
async function updateSpinner(label?: string) {
	await stdout('\r');
	await stdout(`${spinnerStates[currentIndex]} ${label || ''}`);
	currentIndex = (currentIndex + 1) % spinnerStates.length;
}

const originalConsole = console;
function disableOutput() {
	const consoleProxy = new Proxy(console, {
		get() {
			return log;
		},
	});
	Reflect.set(globalThis, 'console', consoleProxy);
}

function enableOutput() {
	Reflect.set(globalThis, 'console', originalConsole);
}

type Callback<T> = () => Promise<T>;
export async function $spinner<T>(callback: Callback<T>): Promise<T>;
export async function $spinner<T>(label: string, callback: Callback<T>): Promise<T>;
export async function $spinner<T>(...arguments_: unknown[]): Promise<T> {
	let label: string | undefined;
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
		await updateSpinner(label);
	}, 120);

	try {
		// Hide the cursor
		await stdout('\u001B[?25l');
		// Execute the callback function
		const result: T = await callback();

		// Return the result after clearing the spinner
		clearInterval(spinnerInterval);
		await stdout('\r');
		await stdout(' '.repeat(spinnerStates.length + (label?.length || 0) + 1)); // Clear the spinner line
		await stdout('\r');

		if (capturedLogs.length > 0) {
			originalConsoleLog(capturedLogs.join('\n'));
		}

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
