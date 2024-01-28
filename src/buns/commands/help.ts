import type { Command } from '../commands';

export const name = "help";
export const desc = "Get the full list of available commands";
export const usage = "buns help";

export default async function run(commands: Map<string, Command>) {
	const help = Array.from(commands.values()).map((command) => {
		let output = `\n  `;
		output += `${chalk.bold(command.name)}`
		if (command.desc) {
			output += ` - `
			output += command.desc
		}
		output += `\n  `
		output += chalk.gray(command.usage)
		output += `\n`

		return output;
	}).join("");

	console.log(help);
}