import type { Command } from '../commands';
import { run as help } from './help';
import { run as create } from './create';

export type InternalCommand = Command & {
	info: {
		name: string;
		desc: string;
		usage: string;
	}
}

export async function router(command: undefined | Command, commands: Map<string, InternalCommand>) {

	let input = argv._[0];

	// Offer to create utility if it doesn't exist.
	if (input && !command) {
		return create();
	}

	if (argv.h || input === "help" || !command) {
		return help(commands);
	}

	try {
		await command.run();
	} catch (e) {
		console.log(chalk.bold.red("Error: ") + e.message);
		if (argv.verbose) {
			console.log(e);
		}
	}




}