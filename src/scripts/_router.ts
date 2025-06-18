import type { Router } from '@lib/router';
import { slugify } from '@lib/utils';
import { create } from './create';
import help from './help';
import version from './version';

export const router: Router['callback'] = async ({ name, exec, command, scripts }) => {
	const input = [name, ...args].map(t => slugify(t)).join(' ');

	// Don't take over flags too eagerly:
	const noArguments = (check?: string | number | boolean) => args.length === 0 && check;

	if (input === 'version' || noArguments(flags.v || flags.version)) {
		await version();
		return;
	}

	// Check for autohelp before general help
	if (command?.autohelp && flags.help) {
		const { displayScriptHelp } = await import('@lib/help-display');
		displayScriptHelp(command);
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
