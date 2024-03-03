import './index'; // eslint-disable-line import/no-unassigned-import, import/order
import type {RouterCallback} from './lib/router';
import {slugify} from './lib/utils';

export async function run(scriptFile: string) {
	const script = await import(scriptFile) as {default: () => Promise<void>};
	if (script.default) {
		await script.default();
	}
}

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

		// Prepare the script
		const exec = async () => import(command.source);

		// Let the router execute the command
		await router({
			namespace,
			name: input,
			command,
			scripts: scripts.scripts,
			exec,
		});
	} catch (error) {
		console.log(ansis.bold.red('Fatal Error: '), error);
	}
}
