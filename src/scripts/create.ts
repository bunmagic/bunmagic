import {
	commandFromString,
	getSources,
	findAny,
	findNamespace,
} from '@lib/sources';
import { SUPPORTED_FILES, get } from '@lib/config';
import { openEditor } from '@lib/utils';
import { Script } from '@lib/script';
import { ensureNamespaceBin, ensureScriptBin } from './reload';

export const desc = 'Create a new script';
export const usage = '<script-name>';
export const alias = ['new'];

export default async function () {
	const slug = args.join(' ');
	if (!slug) {
		throw new Error('Scripts must have a name.');
	}

	return create(slug);
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

async function scriptPath(slug: string): Promise<PartialScriptPath> {
	const commandExists = await $`which ${slug}`.quiet();

	// Check if a command with this name already exists on the system
	if (commandExists.exitCode !== 1) {
		const alias = await $`which ${slug}`.text();
		throw new Exit(`Command "${ansis.bold(slug)}" is already aliased to "${alias.trim()}"\n`);
	}

	// Where to place the script?
	console.log('Creating a new command: ' + slug);
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

async function getExtension(command: string): Promise<string> {
	const parts = command.split('.').map(part => part.trim());

	// If there's no extension, use the default
	if (parts.length === 1) {
		return get('extension');
	}

	// Check for invalid command names
	if (parts.length > 2 || !parts[0] || !parts[1]) {
		throw new Error(`Invalid command name: ${command}`);
	}

	const extension = parts[1];
	if (!SUPPORTED_FILES.includes(extension)) {
		throw new Error(`Unsupported file extension: ${extension}`);
	}

	if (ack(`Use "${ansis.bold(extension)}" as the extension?`)) {
		return extension;
	}


	// @todo: double selection doesn't work
	// return selection('Which extension to use?', SUPPORTED_FILES);
	const result = prompt(`Enter the file extension for "${command}"`);
	if (!result) {
		throw new Error('No file extension provided');
	}

	return result;
}

export async function create(input: string, content = '') {
	// Exception: don't create new bunmagic scripts via "bunmagic create bunmagic <command>" or "bunmagic <command>".
	if (input.startsWith('bunmagic ')) {
		input = input.replace('bunmagic ', '');
	}

	const existing = await findAny(input);

	if (existing) {
		const target = 'source' in existing ? existing.source : existing.dir;
		const messageExists = `The command "${ansis.bold(input)}" already exists:`;
		const messageEdit = `Would you like to edit "${ansis.bold(input)}" ?`;
		if (ack(`${messageExists}\n${messageEdit}`, 'y')) {
			return openEditor(target);
		}

		return true;
	}

	let [slug, namespace] = commandFromString(input);

	// todo make this nicer
	if (slug.includes('.')) {
		slug = slug.split('.')[0];
	}

	const name = namespace ? `${namespace} ${slug}` : slug;
	const partialPath = namespace
		? await namespacedScriptPath(slug, namespace)
		: await scriptPath(slug);

	const extension = await getExtension(input);
	const binaryName = namespace ?? slug;
	const editFilePath = `${partialPath}.${extension}`;
	const targetPath = namespace ?? editFilePath;

	console.log(ansis.dim(`Creating new script: ${editFilePath}`));
	if (!ack(`Create new command "${ansis.bold(name)}" ? `)) {
		throw new Exit('Aborted');
	}

	const script = new Script({
		source: editFilePath,
		namespace,
		slug,
	});
	const binaryFile
		= await (
			namespace
				? ensureNamespaceBin(binaryName, targetPath)
				: ensureScriptBin(script)
		);

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
