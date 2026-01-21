import { Columns } from '@lib/columns';
import { run } from '../run';
import { create } from '../scripts/create';
import { SUPPORTED_FILES } from './config';
import { formatScriptDescription } from './display-utils';
import type { Script } from './script';

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

export const displayScripts = (scripts: Map<string, Script>, namespace?: string) => {
	const columns = new Columns(3, ['auto', 'auto', 'auto']);
	columns.gap = 5;
	columns.buffer();
	columns.log('');
	columns.log(['script', 'args', 'description'].map(s => ansis.dim(s)) as [string, string, string]);
	columns.log(['------', '----', '-----------'].map(s => ansis.dim(s)) as [string, string, string]);
	for (const [name, script] of scripts.entries()) {
		if (script.type !== 'script') {
			continue;
		}

		if (script.alias.includes(name)) {
			continue;
		}

		if (SAF.from(script.source).base?.startsWith('_')) {
			continue;
		}

		const description = formatScriptDescription(script);

		const usage = script.usage || { name: '', description: '' };
		if (usage?.name && usage?.description) {
			columns.log([ansis.bold(script.slug), '', description]);
			// Skip showing namespace in usage if it's redundant
			if (namespace && usage.name === namespace) {
				columns.log(['', '', ansis.dim(usage.description)]);
			} else {
				let usageName = usage.name;
				// Strip namespace prefix if present
				if (namespace?.trim() && usageName.startsWith(`${namespace} `)) {
					usageName = usageName.slice(namespace.length + 1);
				}
				columns.log(['', ansis.dim(usageName), ansis.dim(usage.description)]);
			}
		} else {
			let usageName = script.usage?.name || '';
			if (namespace?.trim() && usageName.startsWith(`${namespace} `)) {
				usageName = usageName.slice(namespace.length + 1);
			}
			columns.log([ansis.bold(script.slug), ansis.gray(usageName), description]);
		}

		if (script.meta) {
			for (const [metaType, metaItems] of Object.entries(script.meta)) {
				if (metaType === 'example') {
					continue;
				}
				for (const { name, description } of metaItems) {
					let displayName = name;

					// For examples and similar metadata, check if it starts with the namespace
					// and remove it to avoid redundancy
					if (namespace?.trim()) {
						// Check if it's just the namespace alone
						if (displayName === namespace) {
							// Show only description in third column
							columns.log(['', '', ansis.dim(description)]);
							continue;
						}
						// Check if it starts with namespace followed by space
						if (displayName.startsWith(`${namespace} `)) {
							displayName = displayName.slice(namespace.length + 1);
						}
					}

					// For certain metadata types like examples, show in third column if no description
					if (metaType === 'example' && !description) {
						columns.log(['', '', ansis.dim(displayName)]);
					} else {
						columns.log(['', ansis.dim(displayName), ansis.dim(description)]);
					}
				}
			}
		}
	}

	columns.flushLog();
};

async function runWithFallback(
	scripts: Map<string, Script>,
	key: string,
	fallback: () => Promise<void>,
) {
	if (scripts.has(key)) {
		const target = scripts.get(key);
		if (target) {
			try {
				await run(target.source);
			} catch (error) {
				throw new Exit(error);
			}
		}
	} else {
		await fallback();
	}
}

const defaultRouter: Router['callback'] = async ({ namespace, name, exec, command, scripts }) => {
	const input = `${namespace} ${name}`.trim();
	// Offer to create utility if it doesn't exist.
	if (name && ((name !== 'help' && !command) || (name === 'create' && !scripts.has('create')))) {
		// Check if strict mode is enabled via environment variable
		if (process.env.BUNMAGIC_STRICT === '1') {
			throw new Exit(`Command not found: ${ansis.bold(input)}`);
		}
		
		await runWithFallback(scripts, 'create', async () => {
			try {
				await create(args[0] ? `${namespace} ${args[0]}` : input);
			} catch (error) {
				throw new Exit(error);
			}
		});
		return;
	}

	if (flags.h || name === 'help' || !command) {
		await runWithFallback(scripts, 'help', async () => {
			if (name && name !== 'help') {
				console.log(ansis.yellow(`> Command not found: ${ansis.bold(input)}\n`));
			}

			displayScripts(scripts, namespace);
		});

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
			const source = (await import(file)) as Record<string, unknown>;
			if (source.router) {
				return {
					file,
					callback: source.router as Router['callback'],
				};
			}

			throw new Error(`Tried to load router from ${file}, but it didn't export a router.`);
		} catch (error) {
			if (flags.debug) {
				console.warn(`Error loading "${file}":\n`, error);
			}
		}
	}

	return {
		file: import.meta.filename,
		callback: defaultRouter,
	};
}
