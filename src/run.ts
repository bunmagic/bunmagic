// eslint-disable-next-line import/no-unassigned-import
import 'bunmagic/globals';
import type {RouterCallback} from './lib/router';
import {slugify} from './lib/utils';

/**
 * This is run by `./bin/bunmagic-exec.ts` to execute a script.
 * It runs the script directly without loading any other dependencies.
 */
export async function run(scriptFile: string) {
	const script = await import(scriptFile) as {default: () => Promise<void>};
	if (script.default) {
		await script.default();
	}
}

/**
 * This is run by `./bin/bunmagic.ts` and `./bin/bunmagic-exec-namespace.ts`.
 * It runs scripts based on a namespace, via the namespace router file.
 */
export async function runNamespace(namespace: string, sourcePath: string) {
	const getPathScripts = await import('./lib/scripts').then(m => m.getPathScripts);
	const scripts = await getPathScripts(sourcePath, namespace);
	const input = slugify(argv._[0] ?? '');

	try {
		if (!scripts.router) {
			throw new Error('No router found.');
		}

		const router: RouterCallback = await import(scripts.router.file).then(m => m.default as RouterCallback);
		if (!router) {
			throw new Error(`Couldn't load the router: ${scripts.router.file}`);
		}

		const command = scripts.scripts.get(input);

		if (!command || command.type === 'not-found') {
			await router({
				namespace,
				name: input,
				command,
				scripts: scripts.scripts,
				exec() {
					throw new Error(`Script not found: ${input}`);
				},
			});
			return;
		}

		// Let the router execute the command
		await router({
			namespace,
			name: input,
			command,
			scripts: scripts.scripts,
			exec: async () => run(command.source),
		});
	} catch (error) {
		console.log(ansis.bold.red('Fatal Error: '), error);
	}
}
