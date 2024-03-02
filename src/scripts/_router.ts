import {slugify} from '@lib/utils';
import type {RouterCallback} from '@lib/router';
import help from './help';
import {create} from './create';
import version from './version';

export const isRouter = true;
const router: RouterCallback = async ({script, command, commands}) => {
	const input = argv._.map(t => slugify(t)).join(' ');
	if (argv.v || argv.version || input === 'version') {
		await version();
		return;
	}

	if (argv.h || argv.help || input === 'help') {
		await help(commands);
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
		await help(commands);
		return;
	}

	try {
		// Shift the first argument off the list and run the script.
		argv._.shift();
		const source = await script();
		// If the script is a module, run it.
		if (source && 'default' in source) {
			await source.default();
		}
	} catch (error) {
		throw new Exit(error);
	}
};

export default router;
