import "bunshell";
import type { RouterCallback } from './lib/commands';


export async function run(scriptFile: string) {
	const script = await import(scriptFile);
	if (script.default) {
		await script.default();
	}
}

export async function runNamespace(namespace: string, sourcePath: string) {
	const getScripts = await import("./lib/sources").then(m => m.getScripts);
	const getCommands = await import("./lib/commands").then(m => m.getCommands);

	const source = await getScripts(sourcePath, namespace);
	const files = source.scripts!.map(script => script.file);

	const { router: routerInfo, commands } = await getCommands(files);
	const input = argv._[0];

	try {

		if (!routerInfo) {
			throw new Error(`No router found.`);
		}

		const router: RouterCallback = await import(routerInfo.file).then(m => m.default);
		if (!router) {
			throw new Error(`Couldn't load the router: ${routerInfo.file}`);
		}

		const command = commands.get(input);


		if (!command || command.type === "not-found") {
			const commandNotFound = () => {
				throw new Error(`Command not found: ${input}`);
			};
			return await router(namespace, input, commandNotFound, command, commands)
		}

		// Prepare the script
		const script = (command.type === "instant-script")
			? () => import(command.file)
			: await import(command.file).then(m => m.default);
		// Let the router execute the command
		await router(namespace, input, script, command, commands);
	} catch (e) {
		console.log(ansis.bold.red("Fatal Error: "), e);
	}
}