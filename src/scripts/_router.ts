import type { RouterCallback } from '../lib/commands';
import help from './help';
import { create } from './create';

export const isRouter = true;
const router: RouterCallback = async (cmd, command, commands) => {

	const input = argv._.join(" ");

	// Offer to create utility if it doesn't exist.
	if (input && !command) {
		await create(input);
		return;
	}

	if (argv.h || input === "help" || !command) {
		await help(commands);
		return;
	}

	try {
		// Shift the first argument off the list and run the command.
		argv._.shift();
		return await cmd();
	} catch (e) {
		console.log(ansis.bold.red("Error: "), e);
		if (argv.verbose) {
			console.log(e);
		}
	}
}
export default router;