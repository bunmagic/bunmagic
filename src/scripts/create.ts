import { get, SUPPORTED_FILES } from '@lib/config';
import { parseInput } from '@lib/parse-input';
import { Script } from '@lib/script';
/**
 * Create a new script
 * @usage <script-name>
 * @alias new
 */
import { findAny, findNamespace, getSources } from '@lib/sources';
import { openEditor, slugify } from '@lib/utils';
import { ensureNamespaceBin, ensureScriptBin } from './reload';

export default async function () {
	const input = args.join(' ');
	if (!input) {
		throw new Error('Scripts must have a name.');
	}

	return create(input);
}

type PartialScriptPath = string & { __partialPath: true };
async function namespacedScriptPath(slug: string, namespace: string): Promise<PartialScriptPath> {
	// Get the namespace directory
	const source = await findNamespace(namespace);
	if (!source) {
		throw new Error(`Namespace "${namespace}" not found`);
	}

	// `createScript` has already checked that the command exists, there's no need to check again.
	return path.resolve(source.dir, slug) as PartialScriptPath;
}

export async function getExtension(extension?: string): Promise<string> {
	// If there's no extension, use the default
	extension ||= await get('extension');

	if (!SUPPORTED_FILES.includes(extension)) {
		console.warn(`Extension "${ansis.bold(extension)}" is not supported.`);
		return select('Which extension to use?', SUPPORTED_FILES);
	}

	return extension;
}

async function scriptPath(slug: string): Promise<PartialScriptPath> {
	const commandExists = await $`which ${slug}`.nothrow().quiet();

	// Check if a command with this name already exists on the system
	if (commandExists.exitCode !== 1) {
		const alias = await $`which ${slug}`.text();
		throw new Exit(`Command "${ansis.bold(slug)}" is already aliased to "${alias.trim()}"\n`);
	}

	// Where to place the script?
	const directories = await getSources().then(sources => sources.map(source => source.dir));
	let directory = directories[0];

	if (directories.length > 1) {
		directory = await select('Which directory to use?', directories);
	}

	if (!directory) {
		throw new Error('No directory selected');
	}

	return path.resolve(directory, slug) as PartialScriptPath;
}

export async function create(input: string, content = '') {
	// Exception: don't create new bunmagic scripts via "bunmagic create bunmagic <command>" or "bunmagic <command>".
	if (slugify(input).startsWith('bunmagic ')) {
		input = input.replace('bunmagic ', '');
	}

	const { command, slug, namespace, extension: rawExtension } = parseInput(input);
	const extension = await getExtension(rawExtension);

	// Look for an existing namespace or script
	const existing = await findAny(slug);
	if (existing) {
		const target = 'source' in existing ? existing.source : existing.dir;
		const messageExists = `"${ansis.bold(command)}" already exists:`;
		const messageEdit = 'Open in editor?';
		if (ack(`${messageExists}\n${messageEdit}`, 'y')) {
			return openEditor(target);
		}

		return true;
	}

	const partialPath = namespace
		? await namespacedScriptPath(slug, namespace)
		: await scriptPath(slug);

	const binaryName = namespace ?? slug;
	const editFilePath = `${partialPath}.${extension}`;
	const targetPath = namespace ?? editFilePath;

	console.log();
	if (!ack(`Create "${ansis.bold(editFilePath)}"?`)) {
		throw new Exit('Aborted');
	}

	const script = new Script({
		source: editFilePath,
		namespace,
		slug,
	});
	const binaryFile = await (namespace
		? ensureNamespaceBin(binaryName, targetPath)
		: ensureScriptBin(script));

	if (binaryFile) {
		await $`chmod +x ${binaryFile}`;
		await $`touch ${editFilePath}`;
	} else if (!namespace) {
		console.log(`\n${ansis.red('▲')} Could not create a symlink to the script.`);
		return false;
	}

	if (content) {
		await Bun.write(editFilePath, content);
	}

	await openEditor(editFilePath);
	return editFilePath;
}
