import type { Command } from '../commands';
import help from './help';
import create from './create';

export type InternalCommand = Command & {
	info: {
		name: string;
		desc: string;
		usage: string;
	}
}
export const isRouter = true;
export default async function router(cmd: () => Promise<void>, command: undefined | Command, commands: Map<string, InternalCommand>) {

	let input = argv._[0];

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
		console.log(chalk.bold.red("Error: "), e);
		if (argv.verbose) {
			console.log(e);
		}
	}




}