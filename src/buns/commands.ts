export type Command = {
	type: "command";
	name: string;
	desc: string;
	usage?: string;
	alias?: string[];
	run: (subtask?: string) => Promise<void>;
}

export type Router = {
	type: "router";
	run: (command: Command | undefined) => Promise<void>;
}

export type NotFound = {
	file: string;
	type: "not-found";
}

async function importCommand(file: string): Promise<Command | Router | NotFound> {
	const handle = await import(file);
	if ("router" in handle) {
		return {
			type: "router",
			run: handle.router
		}
	}
	if ("info" in handle && "run" in handle) {
		return {
			type: "command",
			name: path.parse(file).name,
			...handle
		}
	}
	return {
		file,
		type: "not-found"
	}
}

const supportedFileTypes = [".ts", ".js", ".mjs"];


type CommandList<C extends Command> = {
	router: Router;
	commands: Map<string, C>;
}
export async function getCommands<C extends Command>(files: string[]): Promise<CommandList<C>> {

	const validFiles = files.filter((file: string) => supportedFileTypes.includes(path.extname(file)));
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
		const { run } = await import("./default-router");
		router = {
			type: "router",
			run
		};
	}

	return { router, commands: map };

}
