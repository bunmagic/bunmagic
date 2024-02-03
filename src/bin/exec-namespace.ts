#!/usr/bin/env bun
// import "bunshell";
import { getCommands } from '../lib/commands';
import { getSources } from '../lib/sources';

const namespace = argv._.shift();
if (!namespace) {
	throw new Error(`Missing script namespace.`);
}

const sources = await getSources();
const scripts = sources.find(source => 'namespace' in source && source.namespace === namespace)?.scripts;
const files = scripts!.map(script => script.file);
const { router: routerInfo, commands } = await getCommands(files);
const input = argv._[0];

try {
	if (!routerInfo) {
		throw new Error(`No router found.`);
	}

	const router = await import(routerInfo.file).then(m => m.default);
	if (!router) {
		throw new Error(`Couldn't load the router: ${router.file}`);
	}

	const command = commands.get(input);
	if (command === undefined || command.type === "command") {
		const cmd = command?.file ? await import(command.file).then(m => m.default) : undefined;
		await router(cmd, command, commands);
	}

} catch (e) {
	console.log(ansis.bold.red("Error: "), e);
}
