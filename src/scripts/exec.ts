/**
 * Execute any file with the full bunmagic context
 * @usage exec <file> [args...]
 * @example exec ./scripts/my-script.ts
 * @example exec /path/to/docblocks.ts --verbose
 * @alias x
 */
export default async function exec() {
	// Get the file path from args (already shifted by router)
	const filePath = args.shift();

	// Only show help if no file is provided
	if (!filePath) {
		showHelp({
			name: 'exec',
			description: 'Execute any file with the full bunmagic context',
			usage: 'exec <file> [args...]',
			examples: ['exec ./scripts/my-script.ts', 'exec /path/to/docblocks.ts --verbose'],
		});
		throw new Exit(0);
	}

	// Resolve the file path
	const resolvedPath = path.resolve(filePath);

	// Check if file exists
	if (!(await Bun.file(resolvedPath).exists())) {
		die(`File not found: ${filePath}`);
	}

	// Import the run function
	const { run } = await import('bunmagic/run');

	try {
		// Execute the file - remaining args are already in place
		await run(resolvedPath);
	} catch (error) {
		if (error instanceof Exit || error === Exit) {
			// Exit symbols should be handled normally
			throw error;
		}
		// Show other errors with helpful context
		die(`Error executing ${filePath}: ${error}`);
	}
}
