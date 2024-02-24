async function stdout(content: string) {
	return Bun.write(Bun.stdout, content);
}

async function moveUp(count = 1) {
	await stdout(`\u001B[${count}A`);
}

async function clearLines(count = 1) {
	await moveUp(count);
	await stdout('\r');
	await stdout('\u001B[2K'.repeat(count));
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
		await stdout('\r');
		await moveUp(lineCount);
		await stdout('\r\n\u001B[2K'.repeat(lineCount));
		await moveUp(lineCount);
		await stdout('\r\n');
	} else {
		await clearLines(lineCount);
	}
}

export const CLI = {
	stdout,
	moveUp,
	clearLines,
	hideCursor,
	showCursor,
	clearFrame,
	raw,
} as const;
