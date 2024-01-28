import { SUPPORTED_FILES, type Config } from './config';

export type Command = {
	type: "command";
	file: string;
	name: string;
	desc?: string;
	usage?: string;
	alias?: string[];
}

export type Router = {
	type: "router";
	file: string;
}

export type NotFound = {
	type: "not-found";
	file: string;
}

export type RawCommand = {
	type: "raw-command";
	file: string;
}



async function importCommand(file: string): Promise<Command | RawCommand | Router | NotFound> {
	const lines = (await Bun.file(file).text()).split("\n");

	if (lines.find(line => line.trim().startsWith("export default"))) {
		const handle = await import(file);

		if ("isRouter" in handle && handle.isRouter) {
			return {
				type: "router",
				file,
			}
		}

		if ("default" in handle) {
			const meta = { ...handle, default: undefined };
			return {
				type: "command",
				file,
				name: path.parse(file).name,
				...meta,
			}
		}
	}

	else {
		return {
			type: "raw-command",
			file
		}
	}



	return {
		file,
		type: "not-found"
	}
}

type CommandList<C extends Command> = {
	router: Router;
	commands: Map<string, C>;
}
export async function getCommands<C extends Command>(files: string[]): Promise<CommandList<C>> {
	const validFiles = files.filter((file: string) => SUPPORTED_FILES.includes(path.extname(file).replace('.', '') as Config['extension']));
	const list = await Promise.all(validFiles.map(importCommand));

	const map = new Map();
	let router: Router | undefined;

	for (const command of list) {
		if (command.type === "not-found") {
			console.log(`Found a file, but it's not a command: ${command.file}`);
			continue;
		}
		if (command.type === "command") {
			map.set(command.name, command);

			if (command.alias) {
				for (const alias of command.alias) {
					map.set(alias, command);
				}
			}
		}
		if (router === undefined && command.type === "router") {
			router = command;
		}
	}

	if (router === undefined) {
		const defaultRouter = path.resolve(import.meta.dirname, "default-router.ts");
		router = {
			type: "router",
			file: defaultRouter
		};
	}

	return { router, commands: map };

}
