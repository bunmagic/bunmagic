import { getCommands, type Command } from '../commands';

type InternalCommand = Command & {
	info: {
		name: string;
		desc: string;
		usage: string;
	}
}

export const info = {
	name: "help",
	desc: "Get the full list of available commands",
	usage: "buns help",
}

export async function run() {
	// @TODO: de-dupe fetching files
	const source = path.resolve(import.meta.dir);
	const files = (await $`ls *.ts`.text())
		.split("\n")
		.map((file: string) => file.trim())
		.filter(Boolean)
		.map(file => path.resolve(source, file));

	const { commands } = await getCommands<InternalCommand>(files);

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