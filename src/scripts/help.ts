import type { Command, NotFound, InstantScript, CMD } from '../lib/commands';

export const name = "help";
export const desc = "Get the full list of available commands";
export const usage = "bunism help";


function describeCommand(command: CMD) {
	let desc = `  • ${ansis.bold(command.name)} `;
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
		desc += `\n  `;
		desc += ansis.gray(command.usage);
	}
	return desc.split("\n").join("\n  ");
}

export default async function (commands: Map<string, Command | NotFound | InstantScript>) {
	console.log(`  ${ansis.dim(`# Available commands:`)}`)
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

		if (command.type === "instant-script") {
			console.log(describeCommand(command));
		}

	}
}