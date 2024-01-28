import "./index";
import env_requirements from "./buns/env-requirements";
import { getCommands } from './buns/commands';

// Turn off verbose mode by default
BUNS.verbose = argv.verbose || process.env.DEBUG || false;

// @TODO: move to config?
const source = path.resolve(import.meta.dir, "buns/commands");

cd(source);
const files = (await $`ls`.text())
	.split("\n")
	.map((file: string) => file.trim())
	.filter(Boolean)
	.map(file => path.resolve(source, file));

if (true !== await env_requirements()) {
	console.log(`Environment requirements not met.`);
	process.exit(1);
}

const input = argv._[0];
const { router, commands } = await getCommands(files);

try {
	const command = commands.get(input);
	if (command === undefined || command.type === "command") {
		await router.run(command);
	}

} catch (e) {
	console.log(chalk.bold.red("Error: "), e);
}
