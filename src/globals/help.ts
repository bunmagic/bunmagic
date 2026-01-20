import path from 'node:path';

import { displayScriptHelp } from '../lib/help-display';
import { parseHeader } from '../lib/parse-file-meta';
import { Script } from '../lib/script';
import { findCallerScriptPath } from '../lib/stack-trace';

/**
 * Display help information for the current script.
 * This function reads the JSDoc metadata from the calling script
 * and displays formatted help information.
 *
 * @example
 * if (flags.help) {
 *   await showHelp();
 *   throw new Exit(0);
 * }
 */
export async function showHelp(): Promise<void> {
	// Get the calling script's file path
	// In Bun, we can use Error().stack to trace back to the calling file
	const error = new Error();
	const stack = error.stack?.split('\n');

	if (!stack || stack.length < 3) {
		console.error('Unable to determine calling script');
		return;
	}

	const bunmagicRoot = path.resolve(import.meta.dir, '..');
	const scriptPath = findCallerScriptPath(stack, bunmagicRoot);
	if (!scriptPath) {
		console.error('Unable to determine calling script');
		return;
	}

	if (!(await Bun.file(scriptPath).exists())) {
		console.error('Unable to read calling script');
		return;
	}

	// Parse the script's metadata
	const meta = await parseHeader.fromFile(scriptPath);

	if (!meta) {
		console.error('No metadata found in script');
		return;
	}

	// Create a Script object and display help
	const script = new Script({
		source: scriptPath,
		usage: meta.usage,
		alias: meta.alias,
		desc: meta.description,
		meta: meta.meta,
		autohelp: meta.autohelp,
	});

	// Get namespace from environment if available
	const namespace = process.env.BUNMAGIC_NAMESPACE;
	displayScriptHelp(script, namespace);
}
