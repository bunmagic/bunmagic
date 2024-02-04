import type { Command, NotFound, RawCommand } from '../lib/commands';

export const name = "help";
export const desc = "Get the full list of available commands";
export const usage = "bunshell help";

export default async function (commands: Map<string, Command | NotFound | RawCommand>) {
	let help = ``;
	commands.forEach((command, name) => {
		if (
			command.type !== "command"
			|| (command.alias && command.alias.includes(name))
			|| command.name.startsWith("_")
		) {
			return;
		}
		help += `\n  `;
		help += `${ansis.bold(command.name)} `
		if (command.desc) {
			help += ` - `
			help += command.desc
		}
		if (command.alias) {
			let alias = "";
			alias += ` (alias: `
			alias += command.alias.join(", ")
			alias += `)`
			help += ansis.dim(alias)

		}
		if (command.usage) {
			help += `\n  `
			help += ansis.gray(command.usage)
			help += `\n`
		}

	})

	console.log(help);
}