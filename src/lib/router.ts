import {create} from '../scripts/create';
import help from '../scripts/help';
import type {Command, NotFound, InstantScript} from './commands';

export type Route = {
	/**
	 * The namespace of the command.
	 * For example: `git commit` would be `git`.
	 */
	namespace: string;
	/**
	 * The name of the command.
	 * For example: `git commit` would be `commit`.
	 */
	name: string;
	/**
	 * Information about the script that's being run.
	 */
	command: Command | NotFound | InstantScript | undefined;
	/**
	 * A list of all available scripts.
	 */
	commands: Map<string, Command | NotFound | InstantScript>;
	/**
	 * The script to run.
	 * The router is responsible for running this script and handling any errors.
	 */
	script: () => Promise<void>;
};

export type RouterCallback = (route: Route) => Promise<void>;


const router: RouterCallback = async ({namespace, name, script, command, commands}) => {
	const input = `${namespace} ${name}`;

	// Offer to create utility if it doesn't exist.
	if (name && !command) {
		try {
			await create(input);
		} catch (error) {
			throw new Exit(error);
		}

		return;
	}

	if (argv.h || name === 'help' || !command) {
		if (name && name !== 'help') {
			console.log(ansis.yellow(`> Command not found: ${ansis.bold(input)}\n`));
		}

		await help(commands);
		return;
	}

	if (command) {
		try {
			await script();
		} catch (error) {
			throw new Exit(error);
		}
	} else {
		console.log('No command found.');
	}
};

export default router;