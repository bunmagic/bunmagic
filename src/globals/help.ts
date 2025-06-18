import { parseHeader } from '../lib/parse-file-meta';
import { Script } from '../lib/script';
import { displayScriptHelp } from '../lib/help-display';

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
	
	// Extract file path from stack trace
	// Stack trace format: "at ... (file:///path/to/file.ts:line:col)"
	const callerLine = stack[2]; // Skip this function and the immediate caller
	const match = callerLine.match(/\((.+?):\d+:\d+\)/);
	
	if (!match || !match[1]) {
		console.error('Unable to parse script location from stack trace');
		return;
	}
	
	const scriptPath = match[1].replace('file://', '');
	
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
	
	displayScriptHelp(script);
}