import './index'; // eslint-disable-line import/no-unassigned-import, import/order
import type {RouterCallback} from './lib/commands';
import {slugify} from './lib/utils';

export async function run(scriptFile: string) {
	const script = await import(scriptFile) as {default: () => Promise<void>};
	if (script.default) {
		await script.default();
	}
}

export async function runNamespace(namespace: string, sourcePath: string) {
	const getScripts = await import('./lib/sources').then(m => m.getScripts);
	const getCommands = await import('./lib/commands').then(m => m.getCommands);

	const source = await getScripts(sourcePath, namespace);
	const files = source.scripts.map(script => script.source);

	const {router: routerInfo, commands} = await getCommands(files);
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
			const commandNotFound = () => {
				throw new Error(`Command not found: ${input}`);
			};

			await router(namespace, input, commandNotFound, command, commands);
			return;
		}

		// Prepare the script
		const script = (command.type === 'instant-script')
			? async () => import(command.file)
			: await import(command.file).then(m => m.default as () => Promise<void>);
		// Let the router execute the command
		await router(namespace, input, script, command, commands);
	} catch (error) {
		console.log(ansis.bold.red('Fatal Error: '), error);
	}
}
