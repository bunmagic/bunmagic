import type { Router } from '@lib/router';
import { slugify } from '@lib/utils';
import { create } from './create';
import help from './help';
import version from './version';

export const router: Router['callback'] = async ({ namespace, name, exec, command, scripts }) => {
	const input = [name, ...args].map(t => slugify(t)).join(' ');

	// Don't take over flags too eagerly:
	const noArguments = (check?: string | number | boolean) => args.length === 0 && check;
	const wantsHelp = Boolean(flags.h || flags.help);

	// Help should always win, even when other flags are passed.
	if (wantsHelp && command?.autohelp) {
		const { displayScriptHelp } = await import('@lib/help-display');
		displayScriptHelp(command, namespace);
		return;
	}

	if (wantsHelp) {
		await help(scripts);
		return;
	}

	if (input === 'version' || noArguments(flags.v || flags.version)) {
		await version();
		return;
	}

	if (name === 'help') {
		await help(scripts, args[0]);
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
