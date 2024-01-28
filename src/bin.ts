import "./index";
import { getCommands } from './buns/commands';
import env_requirements from "./buns/env-requirements";


if (true !== await env_requirements()) {
	console.log(`Environment requirements not met.`);
	process.exit(1);
}

const sourceDirectory = argv._.shift();
if (!sourceDirectory) {
	throw new Error(`No command file specified.`);
}

// Turn off verbose mode by default
BUNS.verbose = argv.verbose || Bun.env.DEBUG || false;

const files = (await $`ls ${sourceDirectory}`.text())
	.split("\n")
	.map((file: string) => file.trim())
	.filter(Boolean)
	.map(file => path.resolve(sourceDirectory, file));



const { router, commands } = await getCommands(files);
const input = argv._[0];

try {
	const command = commands.get(input);
	if (command === undefined || command.type === "command") {
		await router.run(command, commands);
	}

} catch (e) {
	console.log(chalk.bold.red("Error: "), e);
}
