import {
	commandFromString,
	getSources,
	findAny,
} from '../lib/sources';
import {get} from '../lib/config';
import {openEditor} from '../lib/utils';
import {ensureBin} from './bins';

export const desc = 'Create a new script';
export const usage = 'bunism create <script-name>';
export const alias = ['new'];

export default async function () {
	const slug = argv._.join(' ');
	if (!slug) {
		throw new Error('Scripts must have a name.');
	}

	return create(slug);
}

type PartialScriptPath = string & {__partialPath: true};
async function namespacedScriptPath(slug: string, namespace: string): Promise<PartialScriptPath> {
	// Get the namespace directory
	const sources = await getSources();
	const source = sources.find(d => 'namespace' in d && d.namespace === namespace);
	if (!source) {
		throw new Error(`Namespace "${namespace}" not found`);
	}

	// `createScript` has already checked that the command exists, there's no need to check again.
	return path.resolve(source.dir, slug) as PartialScriptPath;
}

async function scriptPath(slug: string): Promise<PartialScriptPath> {
	const commandExists = await $`which ${slug}`;

	// Check if a command with this name already exists on the system
	if (commandExists.exitCode !== 1) {
		const alias = await $`which ${slug}`.text();
		die(`Command "${ansis.bold(slug)}" is already aliased to "${alias.trim()}"\n`);
	}

	// Where to place the script?
	console.log('Creating a new command: ' + slug);
	const directories = await getSources().then(sources => sources.map(source => source.dir));
	let directory = directories[0];

	if (directories.length > 1) {
		directory = selection(directories, 'Which directory to use?');
	}

	if (!directory) {
		throw new Error('No directory selected');
	}

	return path.resolve(directory, slug) as PartialScriptPath;
}

export async function create(command: string) {
	// Exception: don't create new bunism scripts via "bunism create bunism <command>" or "bunism <command>".
	if (command.startsWith('bunism ')) {
		command = command.replace('bunism ', '');
	}

	const existing = await findAny(command);

	if (existing) {
		const target = 'source' in existing ? existing.source : existing.dir;
		const messageExists = `The command "${ansis.bold(command)}" already exists:`;
		const messageEdit = `Would you like to edit "${ansis.bold(command)}" ?`;
		if (ack(`${messageExists}\n${messageEdit}`, 'y')) {
			return openEditor(target);
		}

		return true;
	}

	const [slug, namespace] = commandFromString(command);
	const partialPath = namespace
		? await namespacedScriptPath(slug, namespace)
		: await scriptPath(slug);

	const extension = await get('extension', 'ts');
	const binaryName = namespace ?? slug;
	const editFilePath = `${partialPath}.${extension}`;
	const targetPath = namespace ?? editFilePath;

	console.log(ansis.dim(`Creating new script: ${editFilePath}`));
	if (!ack(`Create new command "${ansis.bold(command)}" ? `)) {
		die('Aborted');
	}

	const binaryFile = await ensureBin(binaryName, targetPath, Boolean(namespace));

	if (binaryFile) {
		await $`chmod +x ${binaryFile}`;
		await $`touch ${editFilePath}`;
	} else if (!namespace) {
		console.log(`\n${ansis.red('▲')} Could not create a symlink to the script.`);
		return false;
	}

	await openEditor(editFilePath);
	return editFilePath;
}
