async function stdout(content: string) {
	return Bun.write(Bun.stdout, content);
}

async function moveUp(count = 1) {
	await stdout(`\u001B[${count}A`);
}

async function moveDown(count = 1) {
	await stdout(`\u001B[${count}B`);
}

async function moveRight(count = 1) {
	await stdout(`\u001B[${count}C`);
}

async function moveLeft(count = 1) {
	await stdout(`\u001B[${count}D`);
}

async function clearLines(count = 1) {
	await moveUp(count);
	await stdout('\r');
	await stdout('\u001B[2K'.repeat(count));
}

async function replaceLine(...messages: string[]) {
	await clearLine();
	await stdout(messages.join(' ') + '\n');
}

async function clearLine() {
	await stdout('\r');
	await stdout(' '.repeat(process.stdout.columns));
	await stdout('\r');
	await stdout('\u001B[2K');
}

async function clearUp(count = 1) {
	for (let index = 0; index < count; index++) {
		await clearLine();
		await moveUp(1);
	}

	await moveDown(count);
}

async function hideCursor() {
	await stdout('\u001B[?25l');
}

async function showCursor() {
	await stdout('\u001B[?25h');
}

async function raw(on: boolean) {
	process.stdin.setRawMode(on);
}

async function clearFrame(frame: string, wipe = false) {
	const lines = frame.split('\n');
	const lineCount = lines.length - 1;
	if (wipe) {
		await moveUp(lineCount);
		await stdout(lines.map(line => '\r' + ' '.repeat(line.length)).join('\n'));
		await clearLines(lineCount);
	} else {
		await clearLines(lineCount);
	}
}

async function* chunkStreamer5000(signal: AbortController['signal']) {
	process.stdin.setRawMode(true);
	const reader = Bun.stdin.stream().getReader() as ReadableStreamDefaultReader<Uint8Array>;
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done || signal.aborted) {
				break;
			}

			yield value;
		}
	} catch (error) {
		console.error('Error in CLI.streamChunks:', error);
	} finally {
		reader.releaseLock();
		process.stdin.setRawMode(false);
	}
}

function stream() {
	const controller = new AbortController();
	const start = () => chunkStreamer5000(controller.signal);

	const stop = () => {
		controller.abort();
	};

	return { start, stop };
}

export const CLI = {
	stdout,
	moveUp,
	moveDown,
	moveRight,
	moveLeft,
	clearLines,
	clearLine,
	replaceLine,
	clearUp,
	hideCursor,
	showCursor,
	clearFrame,
	raw,
	stream,
} as const;
