import type { RouterCallback } from '../lib/commands';
import help from './help';
import { create } from './create';
import version from './version';
import { slugify } from '../lib/utils';

export const isRouter = true;
const router: RouterCallback = async (_, __, cmd, command, commands) => {
	const input = argv._.map(slugify).join(" ");
	console.log('input', input);
	if (argv.v || input === "version") {
		await version();
		return;
	}

	if (argv.h || input === "help") {
		await help(commands);
		return;
	}

	// Offer to create utility if it doesn't exist.
	if (input && !command) {
		try {
			await create(input);
			return;
		} catch (e) {
			die(e);
		}
	}

	if (!command) {
		await help(commands);
		return;
	}


	try {
		// Shift the first argument off the list and run the command.
		argv._.shift();
		return await cmd();
	} catch (e) {
		die(e);
	}
}
export default router;