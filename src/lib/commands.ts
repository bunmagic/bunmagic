import { SUPPORTED_FILES, type Config } from './config';

export type CMD = {
	file: string;
	name: string;
	desc?: string;
	usage?: string;
	alias?: string[];
}

export type InstantScript = CMD & {
	type: "instant-script";
}

export type Command = CMD & {
	type: "command";
}

export type Router = {
	type: "router";
	file: string;
}

export type NotFound = {
	type: "not-found";
	file: string;
}


export type RouterCallback = (
	cmd: () => Promise<void>,
	command: Command | NotFound | InstantScript | undefined,
	commands: Map<string, Command | NotFound | InstantScript>
) => Promise<void>;


function commentToString(needle: string, haystack: string[]) {
	const str = `// ${needle}`;
	const line = haystack.find((line) => line.trim().startsWith(str));
	if (!line) {
		return;
	}
	// Remove ` - ` and `:` between needle and the content.
	let value = line.replace(str, "").trim();
	while (value.length > 0 && (value.startsWith(":") || value.startsWith("-") || value.startsWith(" "))) {
		value = value.slice(1);
	}
	if (value.length === 0) {
		return;
	}
	return value;
}
function parseInstantScript(filePath: string, allLines: string[]): InstantScript {
	// Only search first 20 lines.
	const lines = allLines.slice(0, 20);

	const name = commentToString("name", lines) ?? path.basename(filePath, path.extname(filePath))
	const desc = commentToString("desc", lines);
	const usage = commentToString("usage", lines);
	const alias = commentToString("alias", lines)?.split(",").map((alias) => alias.trim());

	if (!name) {
		throw new Error(`Instant script at ${filePath} must have a name.`);
	}

	return {
		type: "instant-script",
		file: filePath,
		name,
		desc,
		usage,
		alias: alias
	}
}

async function importCommand(file: string): Promise<Command | InstantScript | Router | NotFound> {
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
				name: path.parse(file).name,
				type: "command",
				file,
				...meta,
			}
		}
	}

	else {
		return parseInstantScript(file, lines);
	}



	return {
		file,
		type: "not-found"
	}
}

type CommandList = {
	router: Router;
	commands: Map<string, Command | NotFound | InstantScript>;
}

export async function getCommands(files: string[]): Promise<CommandList> {
	const validFiles = files.filter((file: string) => SUPPORTED_FILES.includes(path.extname(file).replace('.', '') as Config['extension']));
	const list = await Promise.all(validFiles.map(importCommand));

	const map = new Map();
	let router: Router | undefined;

	for (const command of list) {
		if (command.type === "not-found") {
			console.log(`Found a file, but it's not a command: ${command.file}`);
			continue;
		}
		if (command.type === "command" || command.type === "instant-script") {
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
