import { slugify } from '@lib/utils';
import type { Router } from '@lib/router';
import help from './help';
import { create } from './create';
import version from './version';

export const router: Router['callback'] = async ({ name, exec, command, scripts }) => {
	const input = [name, ...args].map(t => slugify(t)).join(' ');

	// Don't take over flags too eagerly:
	const noArguments = (check?: string | number | boolean) => args.length === 0 && check;

	if (input === 'version' || noArguments(flags.v || flags.version)) {
		await version();
		return;
	}

	if (input === 'help' || noArguments(flags.h || flags.help)) {
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
