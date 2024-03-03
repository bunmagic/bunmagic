import { create } from '../scripts/create';
import help from '../scripts/help';
import type { Script } from './script';
import { SUPPORTED_FILES } from './config';

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
	command: Script | undefined;
	/**
	 * A list of all available scripts.
	 */
	scripts: Map<string, Script>;
	/**
	 * The script to run.
	 * The router is responsible for running this script and handling any errors.
	 */
	exec: () => Promise<void | { default: () => Promise<void> }>;
};

export type Router = {
	file: string;
	callback: (route: Route) => Promise<void>;
};


const defaultRouter: Router['callback'] = async ({ namespace, name, exec, command, scripts }) => {
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

		await help(scripts);
		return;
	}

	if (command) {
		try {
			await exec();
		} catch (error) {
			throw new Exit(error);
		}
	} else {
		console.log('No command found.');
	}
};


export async function getRouter(sourcePath: string): Promise<Router> {
	const routerGlob = new Bun.Glob('**router.*');

	for await (const file of routerGlob.scan({
		cwd: sourcePath,
		absolute: true,
		onlyFiles: true,
	})) {
		const extension = path.extname(file).slice(1);
		if (!SUPPORTED_FILES.includes(extension)) {
			continue;
		}

		try {
			const source = await import(file) as Record<string, unknown>;
			if (source.router) {
				return {
					file,
					callback: source.router as Router['callback'],
				};
			}

			throw new Error(`Tried to load router from ${file}, but it didn't export a router.`);
		} catch (error) {
			if (argv.debug) {
				console.warn(`Error loading "${file}":\n`, error);
			}
		}
	}

	return {
		file: import.meta.filename,
		callback: defaultRouter,
	};
}
