/**
 * Execute any file with the full bunmagic context
 * @usage exec <file> [args...]
 * @flag --namespace <name> Set namespace for the executed script (for testing)
 * @example exec ./scripts/my-script.ts
 * @example exec /path/to/docblocks.ts --verbose
 * @example exec script.ts --namespace myapp --help
 * @alias x
 */
export default async function exec() {
	// Check for namespace flag
	const namespace = flags.namespace as string | undefined;
	flags.namespace = undefined; // Remove it so it doesn't interfere with the target script

	// Get the file path from args (already shifted by router)
	const filePath = args.shift();

	// Only show help if no file is provided
	if (!filePath) {
		await showHelp();
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
		// Set namespace in environment if provided
		if (namespace) {
			process.env.BUNMAGIC_NAMESPACE = namespace;
		}

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
