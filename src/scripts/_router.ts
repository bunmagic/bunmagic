import type { Command } from '../lib/commands';
import help from './help';
import create from './create';

export const isRouter = true;
export default async function router(cmd: () => Promise<void>, command: undefined | Command, commands: Map<string, Command>) {

	let input = argv._.shift();

	// Offer to create utility if it doesn't exist.
	if (input && !command) {
		return create();
	}

	if (argv.h || input === "help" || !command) {
		return help(commands);
	}

	try {
		await cmd();
	} catch (e) {
		console.log(ansis.bold.red("Error: "), e);
		if (argv.verbose) {
			console.log(e);
		}
	}




}