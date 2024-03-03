// eslint-disable-next-line import/no-unassigned-import
import 'bunmagic/globals';

/**
 * This is run by `./bin/bunmagic-exec.ts` to execute a script.
 * It runs the script directly without loading any other dependencies.
 */
export async function run(scriptFile: string) {
	const script = await import(scriptFile) as { default: () => Promise<void> };
	if (script.default) {
		await script.default();
	}
}

/**
 * This is run by `./bin/bunmagic.ts` and `./bin/bunmagic-exec-namespace.ts`.
 * It runs scripts based on a namespace, via the namespace router file.
 */
export async function runNamespace(namespace: string, sourcePath: string) {
	const { getPathScripts } = await import(`@lib/scripts`);
	const { getRouter } = await import(`@lib/router`);
	const { slugify } = await import(`@lib/utils`);

	const scripts = await getPathScripts(sourcePath, namespace);
	const router = await getRouter(sourcePath);

	const name = slugify(argv._[0] ?? ``);

	try {
		if (!router) {
			throw new Error(`Couldn't load the router.`);
		}

		if (argv.debug) {
			console.log(`Running ${ansis.bold(name)} via router: ${router.file}`);
		}

		const command = scripts.get(name);

		if (!command) {
			await router.callback({
				namespace,
				name,
				command,
				scripts,
				exec() {
					throw new Error(`Script not found: ${name}`);
				},
			});
			return;
		}

		// Let the router execute the command
		await router.callback({
			namespace,
			name,
			command,
			scripts,
			exec: async () => run(command.source),
		});
	} catch (error) {
		console.log(ansis.bold.red(`Fatal Error: `), error);
	}
}
