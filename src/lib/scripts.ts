import { SUPPORTED_FILES } from './config';
import { Script } from './script';


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

function scriptFromText(source: string, allLines: string[], namespace?: string): Script {
	// Only search first 20 lines.
	const lines = allLines.slice(0, 20);

	const slug = commentToString('name', lines);
	const desc = commentToString('desc', lines);
	const usage = commentToString('usage', lines);
	const alias = commentToString('alias', lines)?.split(',').map(alias => alias.trim()) ?? [];

	return new Script({
		slug,
		source,
		namespace,
		desc,
		usage,
		alias,
	});
}

function scriptFromExport(source: string, handle: Record<string, unknown>, namespace?: string): Script {
	// Remove the `default` property from the object.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { default: _, ...meta } = handle;
	const alias = Array.isArray(meta.alias) && meta.alias.every(alias => typeof alias === 'string') ? meta.alias : [];
	const usage = typeof meta.usage === 'string' ? meta.usage : undefined;
	const desc = typeof meta.desc === 'string' ? meta.desc : undefined;
	return new Script({
		namespace,
		source,
		alias,
		usage,
		desc,
	});
}

async function describeFile(file: string, namespace?: string): Promise<Script | NotFound> {
	const content = await Bun.file(file).text();
	const lines = content.split('\n');

	if (lines.some(line => line.trim().startsWith('export default'))) {
		const handle = await import(file) as Record<string, unknown>;
		if ('default' in handle) {
			return scriptFromExport(file, handle, namespace);
		}
	} else {
		return scriptFromText(file, lines, namespace);
	}

	return {
		file,
		type: 'not-found',
	};
}

export async function getPathScripts(target: string, namespace?: string): Promise<Map<string, Script | NotFound >> {
	const glob = new Bun.Glob(`*.{${SUPPORTED_FILES.join(',')}}`);
	const files = [];
	for await (const file of glob.scan({ onlyFiles: true, absolute: false, cwd: target })) {
		if (file.startsWith('_')) {
			if (argv.debug) {
				console.log(`Ignoring: ${file}`);
			}

			continue;
		}

		files.push(path.join(target, file));
	}

	return getScripts(files, namespace);
}

async function getScripts(files: string[], namespace?: string): Promise<Map<string, Script | NotFound >> {
	const validFiles = files.filter((file: string) => SUPPORTED_FILES.includes(path.extname(file).replace('.', '')));
	const list = await Promise.all(validFiles.map(async value => describeFile(value, namespace)));

	const map = new Map<string, Script | NotFound >();

	for (const command of list) {
		if (command.type === 'not-found') {
			console.log(`Found a file, but it's not a command: ${command.file}`);
			continue;
		}

		if (command.type === 'script') {
			if (map.has(command.slug)) {
				console.warn(`Warning: Duplicate command slug '${command.slug}' detected. Skipping.`);
			} else {
				map.set(command.slug, command);
			}

			for (const alias of command.alias) {
				if (map.has(alias)) {
					console.warn(`Warning: Alias '${alias}' conflicts with an existing command or alias. Skipping.`);
				} else {
					map.set(alias, command);
				}
			}
		}
	}

	return map;
}


