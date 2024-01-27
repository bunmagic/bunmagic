import "./index";
import { commands } from "./buns/commands";
import env_requirements from "./buns/env-requirements";

// Turn off verbose mode by default
BUNS.verbose = argv.verbose || process.env.DEBUG || false;

function list(commands) {

	return (
		Object.keys(commands)
			.map((name) => {
				const { desc, usage } = commands[name];


				let output = `\n  `
				output += `${chalk.bold(name)}`
				if (usage) {
					output += ` - `
					output += usage
				}
				output += `\n  `
				output += chalk.gray(desc)
				output += `\n`

				return output;
			})
			.join("")
	);
}

if (true !== await env_requirements()) {
	console.log(`Environment requirements not met.`);
	process.exit(1);
}

const input = argv._[0];
const aliases = {
	ls: "list",
	rm: "remove",
	new: "create"
};

let action;
let subtask;

if (commands[input] || aliases[input]) {
	action = argv._[0];
	subtask = argv._[1];
}

if (argv.h || input === "help") {
	action = "help";
}


if (aliases[input]) {
	action = aliases[input];
}

// Offer to create utility if it doesn't exist.
if (input && !action) {
	action = "create";
	subtask = input;
}

if (action === "help" || !input) {
	console.log(chalk.bold(`\n  Available commands:`));
	console.log(list(commands));
	console.log();
	process.exit(0);
}

if (action) {
	try {
		await commands[action].command(subtask);
	} catch (e) {
		console.log(chalk.bold.red("Error: ") + e.message);
		if (BUNS.verbose) {
			console.log(e);
		}
	}
}
