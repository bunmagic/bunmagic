/**
 * This is run by `./bin/bunmagic-exec.ts` to execute a script.
 * It runs the script directly without loading any other dependencies.
 */
export async function run(scriptFile: string, skipAutoHelp = false) {
	// Check for autohelp if not explicitly skipped
	if (!skipAutoHelp && flags.help) {
		const { parseHeader } = await import('@lib/parse-file-meta');
		const { Script } = await import('@lib/script');
		const { displayScriptHelp } = await import('@lib/help-display');
		
		const meta = await parseHeader.fromFile(scriptFile);
		if (meta?.autohelp) {
			const scriptObj = new Script({
				source: scriptFile,
				usage: meta.usage,
				alias: meta.alias,
				desc: meta.description,
				meta: meta.meta,
				autohelp: meta.autohelp,
			});
			displayScriptHelp(scriptObj);
			throw new Exit(0);
		}
	}

	const script = (await import(scriptFile)) as { default: () => Promise<void> };
	if (script.default) {
		await script.default();
	}
}

/**
 * This is run by `./bin/bunmagic.ts` and `./bin/bunmagic-exec-namespace.ts`.
 * It runs scripts based on a namespace, via the namespace router file.
 */
export async function runNamespace(namespace: string, sourcePath: string) {
	const { getPathScripts } = await import('@lib/scripts');
	const { getRouter } = await import('@lib/router');
	const { slugify } = await import('@lib/utils');

	const scripts = await getPathScripts(sourcePath, namespace);
	const router = await getRouter(sourcePath);

	const name = slugify(args.shift() ?? '');

	try {
		if (!router) {
			throw new Error(`Couldn't load the router.`);
		}

		if (flags.debug) {
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
		console.log(ansis.bold.red('Fatal Error: '), error);
	}
}
