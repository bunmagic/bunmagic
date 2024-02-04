import type { Command, NotFound, RawCommand } from '../lib/commands';

export const name = "help";
export const desc = "Get the full list of available commands";
export const usage = "bunshell help";


function describeCommand(command: Command) {
	let desc = `\n${ansis.bold(command.name)} `;
	if (command.desc) {
		desc += ` - `;
		desc += command.desc;
	}
	if (command.alias) {
		let alias = "";
		alias += ` (alias: `
		alias += command.alias.join(", ")
		alias += `)`
		desc += ansis.dim(alias);

	}
	if (command.usage) {
		desc += `\n`;
		desc += ansis.gray(command.usage);
	}
	return desc.split("\n").join("\n  ");
}

async function describeRawCommand(command: RawCommand) {
	let desc = `\n${ansis.bold(command.name)}`;
	return desc.split("\n").join("\n  ");
}

export default async function (commands: Map<string, Command | NotFound | RawCommand>) {
	for (const [name, command] of commands.entries()) {
		if (('alias' in command && command.alias && command.alias.includes(name))) {
			continue;
		}
		if (Bun.file(command.file).name?.startsWith("_")) {
			continue;
		}
		if (command.type === "command") {
			console.log(describeCommand(command));
		}

		if (command.type === "raw-command") {
			console.log(await describeRawCommand(command));
		}

	}
}