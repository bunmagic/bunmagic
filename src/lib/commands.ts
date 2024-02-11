import {SUPPORTED_FILES, type Config} from './config';

export type CMD = {
	file: string;
	name: string;
	desc?: string;
	usage?: string;
	alias?: string[];
};

export type InstantScript = CMD & {
	type: 'instant-script';
};

export type Command = CMD & {
	type: 'command';
};

export type Router = {
	type: 'router';
	file: string;
};

export type NotFound = {
	type: 'not-found';
	file: string;
};

function commentToString(needle: string, haystack: string[]) {
	const string_ = `// ${needle}`;
	const line = haystack.find(line => line.trim().startsWith(string_));
	if (!line) {
		return;
	}

	// Remove ` - ` and `:` between needle and the content.
	let value = line.replace(string_, '').trim();
	while (value.length > 0 && (value.startsWith(':') || value.startsWith('-') || value.startsWith(' '))) {
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

	const name = commentToString('name', lines) ?? path.basename(filePath, path.extname(filePath));
	const desc = commentToString('desc', lines);
	const usage = commentToString('usage', lines);
	const alias = commentToString('alias', lines)?.split(',').map(alias => alias.trim());

	if (!name) {
		throw new Error(`Instant script at ${filePath} must have a name.`);
	}

	return {
		type: 'instant-script',
		file: filePath,
		name,
		desc,
		usage,
		alias,
	};
}

async function importCommand(file: string): Promise<Command | InstantScript | Router | NotFound> {
	const content = await Bun.file(file).text();
	const lines = content.split('\n');
	if (lines.some(line => line.trim().startsWith('export default'))) {
		const handle = await import(file) as Record<string, unknown>;

		if ('isRouter' in handle && handle.isRouter) {
			return {
				type: 'router',
				file,
			};
		}

		if ('default' in handle) {
			const meta = {...handle, default: undefined};
			return {
				name: path.parse(file).name,
				type: 'command',
				file,
				...meta,
			};
		}
	} else {
		return parseInstantScript(file, lines);
	}

	return {
		file,
		type: 'not-found',
	};
}

type CommandList = {
	router: Router;
	commands: Map<string, Command | NotFound | InstantScript>;
};

export async function getCommands(files: string[]): Promise<CommandList> {
	const validFiles = files.filter((file: string) => SUPPORTED_FILES.includes(path.extname(file).replace('.', '') as Config['extension']));
	const list = await Promise.all(validFiles.map(async value => importCommand(value)));

	const map = new Map<string, Command | NotFound | InstantScript>();
	let router: Router | undefined;

	for (const command of list) {
		if (command.type === 'not-found') {
			console.log(`Found a file, but it's not a command: ${command.file}`);
			continue;
		}

		if (command.type === 'command' || command.type === 'instant-script') {
			map.set(command.name, command);

			if (command.alias) {
				for (const alias of command.alias) {
					map.set(alias, command);
				}
			}
		}

		if (router === undefined && command.type === 'router') {
			router = command;
		}
	}

	if (router === undefined) {
		const defaultRouter = path.resolve(import.meta.dirname, 'router.ts');
		router = {
			type: 'router',
			file: defaultRouter,
		};
	}

	return {router, commands: map};
}
