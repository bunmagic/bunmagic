import {
	commandFromStr,
	getSources,
	search,
} from "../lib/sources";
import { ensureBin } from "./bins";
import { openEditor } from "./edit";
import { get } from '../lib/config';

export const desc = `Create a new script`;
export const usage = `bunshell create <script-name>`;
export const alias = ["new"];

export default async function () {
	const slug = argv._.join(" ");
	if (!slug) {
		throw new Error('Scripts must have a name.');
	}
	return await create(slug);
}



type PartialScriptPath = string & { __partialPath: true };
async function namespacedScriptPath(slug: string, namespace: string): Promise<PartialScriptPath> {

	// Get the namespace directory
	const sources = await getSources();
	const source = sources.find((dir) => 'namespace' in dir && dir.namespace === namespace);
	if (!source) {
		throw new Error(`Namespace "${namespace}" not found`);
	}

	// `createScript` has already checked that the command exists, there's no need to check again.
	return path.resolve(source.path, slug) as PartialScriptPath;
}

async function scriptPath(slug: string): Promise<PartialScriptPath> {
	const commandExists = await $`which ${slug}`;

	// Check if a command with this name already exists on the system
	if (commandExists.exitCode !== 1) {
		const alias = await $`which ${slug}`.text();
		console.log(
			`Command "${ansis.bold(slug)}" is already aliased to "${alias.trim()}"\n`,
		);
		process.exit(1);
	}

	// Where to place the script?
	console.log("Creating a new command: " + slug);
	const directories = await getSources().then((sources) => sources.map((source) => source.path));
	let directory = directories[0];

	if (directories.length > 1) {
		directory = selection(directories, `Which directory to use?`);
	}

	if (!directory) {
		throw new Error("No directory selected");
	}

	return path.resolve(directory, slug) as PartialScriptPath;
}

export async function create(command: string) {
	const existing = await search(command);

	if (existing) {
		const target = 'file' in existing ? existing.file : existing.path;
		const messageExists = `The command "${ansis.bold(command)}" already exists:`;
		const messageEdit = `Would you like to edit "${ansis.bold(command)}" ?`;
		if (ack(`${messageExists}\n${messageEdit}`, "y")) {
			return await openEditor(target);
		}
		return true;
	}

	const [slug, namespace] = commandFromStr(command);
	const partialPath = namespace
		? await namespacedScriptPath(slug, namespace)
		: await scriptPath(slug);

	const ext = await get("extension", "ts");
	const binName = namespace ? namespace : slug;
	const editFilePath = `${partialPath}.${ext}`;
	const targetPath = namespace ? namespace : editFilePath;

	console.log(ansis.dim(`Creating new script: ${editFilePath}`));
	if (!ack(`Create new command "${ansis.bold(command)}" ? `)) {
		process.exit(0);
	}

	const binFile = await ensureBin(binName, targetPath, Boolean(namespace));

	if (binFile) {
		await $`chmod +x ${binFile}`;
		await $`touch ${editFilePath}`;
	} else if (!namespace) {
		console.log(`\n${ansis.red("▲")} Could not create a symlink to the script.`);
		return false;
	}


	await openEditor(editFilePath);
	return editFilePath;
}