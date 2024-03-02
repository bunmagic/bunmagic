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
	const getPathCommands = await import('./lib/commands').then(m => m.getPathScripts);
	const {router: routerInfo, scripts: commands} = await getPathCommands(sourcePath, namespace);
	const input = slugify(argv._[0] ?? '');

	try {
		if (!routerInfo) {
			throw new Error('No router found.');
		}

		const router: RouterCallback = await import(routerInfo.file).then(m => m.default as RouterCallback);
		if (!router) {
			throw new Error(`Couldn't load the router: ${routerInfo.file}`);
		}

		const command = commands.get(input);

		if (!command || command.type === 'not-found') {
			const scriptNotFound = () => {
				throw new Error(`Script not found: ${input}`);
			};

			await router({
				namespace,
				name: input,
				command,
				commands,
				script: scriptNotFound,
			});
			return;
		}

		// Prepare the script
		const script = async () => import(command.source);

		// Let the router execute the command
		await router({
			namespace,
			name: input,
			command,
			commands,
			script,
		});
	} catch (error) {
		console.log(ansis.bold.red('Fatal Error: '), error);
	}
}
