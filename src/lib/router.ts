import {create} from '../scripts/create';
import help from '../scripts/help';
import type {Script, NotFound} from './scripts';

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
	command: Script | NotFound | undefined;
	/**
	 * A list of all available scripts.
	 */
	commands: Map<string, Script | NotFound>;
	/**
	 * The script to run.
	 * The router is responsible for running this script and handling any errors.
	 */
	exec: () => Promise<void | {default: () => Promise<void>}>;
};

export type RouterCallback = (route: Route) => Promise<void>;


const router: RouterCallback = async ({namespace, name, exec, command, commands}) => {
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
			const source = await exec();
			// If the script is a module, run it.
			if (source && 'default' in source) {
				await source.default();
			}
		} catch (error) {
			throw new Exit(error);
		}
	} else {
		console.log('No command found.');
	}
};

export default router;
