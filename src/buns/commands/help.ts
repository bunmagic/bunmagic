import type { InternalCommand } from './_router';

export const info = {
	name: "help",
	desc: "Get the full list of available commands",
	usage: "buns help",
}

export async function run(commands: Map<string, InternalCommand>) {
	const help = Array.from(commands.values()).map((command) => {
		let output = `\n  `;
		output += `${chalk.bold(command.name)}`
		if (command.info.desc) {
			output += ` - `
			output += command.info.desc
		}
		output += `\n  `
		output += chalk.gray(command.info.usage)
		output += `\n`

		return output;
	}).join("");

	console.log(help);
}