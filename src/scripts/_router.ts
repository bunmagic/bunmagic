import { slugify } from '@lib/utils';
import type { RouterCallback } from '@lib/router';
import help from './help';
import { create } from './create';
import version from './version';

export const isRouter = true;
const router: RouterCallback = async ({ exec, command, scripts }) => {
	const input = argv._.map(t => slugify(t)).join(' ');
	if (argv.v || argv.version || input === 'version') {
		await version();
		return;
	}

	if (argv.h || argv.help || input === 'help') {
		await help(scripts);
		return;
	}

	// Offer to create utility if it doesn't exist.
	if (input && !command) {
		try {
			await create(input);
			return;
		} catch (error) {
			throw new Exit(error);
		}
	}

	if (!command) {
		await help(scripts);
		return;
	}

	try {
		// Shift the first argument off the list and run the script.
		argv._.shift();
		await exec();
	} catch (error) {
		throw new Exit(error);
	}
};

export default router;
