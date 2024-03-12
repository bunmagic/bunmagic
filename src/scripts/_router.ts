import { slugify } from '@lib/utils';
import type { Router } from '@lib/router';
import help from './help';
import { create } from './create';
import version from './version';

export const router: Router['callback'] = async ({ name, exec, command, scripts }) => {
	const input = [name, ...args].map(t => slugify(t)).join(' ');
	if (flags.v || flags.version || input === 'version') {
		await version();
		return;
	}

	if (flags.h || flags.help || input === 'help') {
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
		await exec();
	} catch (error) {
		throw new Exit(error);
	}
};
