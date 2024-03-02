import {SUPPORTED_FILES, type Config, PATHS} from './config';
import {slugify} from './utils';

export type Script = {
	type: 'script';
	/**
	 * The command name, for example:
	 * `my-command`
	 */
	slug: string;
	/**
	 * The full command name, for example:
	 * `my-namespace my-command`
	 */
	command: string;
	/**
	 * The full path to the bin file, for example
	 * `~/.bunmagic/bins/my-command`
	 */
	bin: string;
	/**
	 * The directory path, for example:
	 * `/path/to/dir `
	 */
	dir: string;
	/**
	 * The filename, for example:
	 * `my-command.js`
	 */
	filename: string;
	/**
	 * The full source path, for example:
	 * `/path/to/dir/my-command.js`
	 */
	source: string;

	/**
	 * A description of the command.
	 * Used in the help command.
	 */
	desc: string | undefined;

	/**
	 * A usage example of the command.
	 * Used in the help command.
	 */
	usage: string | undefined;

	/**
	 * A list of aliases for the command.
	 * Creates bin files for each alias.
	 */
	alias: string[] | undefined;
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

function extractScriptMetadata(filePath: string, allLines: string[], namespace?: string): Script {
	// Only search first 20 lines.
	const lines = allLines.slice(0, 20);

	const name = commentToString('name', lines) ?? path.basename(filePath, path.extname(filePath));
	const desc = commentToString('desc', lines);
	const usage = commentToString('usage', lines);
	const alias = commentToString('alias', lines)?.split(',').map(alias => alias.trim());

	if (!name) {
		throw new Error(`Instant script at ${filePath} must have a name.`);
	}

	const slug = slugify(name);
	return {
		source: filePath,
		type: 'script',
		filename: path.basename(filePath),
		command: namespace ? `${namespace} ${slug}` : slug,
		bin: `${PATHS.bins}/${slug}`,
		dir: path.dirname(filePath),
		slug,
		desc,
		usage,
		alias,
	};
}

async function describeCommand(file: string, namespace?: string): Promise<Script | Router | NotFound> {
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
			// Remove the `default` property from the object.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const {default: _, ...meta} = handle;
			const slug = path.parse(file).name;
			const alias = Array.isArray(meta.alias) && meta.alias.every(alias => typeof alias === 'string') ? meta.alias : [];
			const usage = typeof meta.usage === 'string' ? meta.usage : undefined;
			const desc = typeof meta.desc === 'string' ? meta.desc : undefined;
			return {
				slug,
				type: 'script',
				command: namespace ? `${namespace} ${slug}` : slug,
				bin: `${PATHS.bins}/${slug}`,
				dir: path.dirname(file),
				filename: path.basename(file),
				source: file,
				alias,
				usage,
				desc,
			};
		}
	} else {
		return extractScriptMetadata(file, lines, namespace);
	}

	return {
		file,
		type: 'not-found',
	};
}

type ScriptList = {
	router: Router;
	scripts: Map<string, Script | NotFound >;
};
export async function getPathScripts(target: string, namespace?: string): Promise<ScriptList> {
	const result = await $`ls ${target}`.text();
	const files = result.split('\n')
		.map((file: string) => `${target}/${file}`)
		.filter((file: string) => SUPPORTED_FILES.some((extension: string) => file.endsWith(extension)));
	return getScripts(files, namespace);
}

async function getScripts(files: string[], namespace?: string): Promise<ScriptList> {
	const validFiles = files.filter((file: string) => SUPPORTED_FILES.includes(path.extname(file).replace('.', '') as Config['extension']));
	const list = await Promise.all(validFiles.map(async value => describeCommand(value, namespace)));

	const map = new Map<string, Script | NotFound >();
	let router: Router | undefined;

	for (const command of list) {
		if (command.type === 'not-found') {
			console.log(`Found a file, but it's not a command: ${command.file}`);
			continue;
		}

		if (command.type === 'script') {
			const commandSlug = slugify(command.slug);
			if (map.has(commandSlug)) {
				console.warn(`Warning: Duplicate command slug '${commandSlug}' detected. Skipping.`);
			} else {
				map.set(commandSlug, command);
			}

			if (command.alias) {
				for (const alias of command.alias) {
					// @TODO - simplify - remove the need for this eslint ignore:
					// eslint-disable-next-line max-depth
					if (map.has(alias)) {
						console.warn(`Warning: Alias '${alias}' conflicts with an existing command or alias. Skipping.`);
					} else {
						map.set(alias, command);
					}
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

	return {router, scripts: map};
}
