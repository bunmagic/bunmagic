import {
	getSources,
	search,
} from "../lib/sources";
import { ensureBin } from "../lib/bins";
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

export function commandFromStr(input: string): [string, string | undefined] {
	const arr = input.split(" ");
	if (arr.length === 1) {
		return [arr[0], undefined];
	}
	if (arr.length === 2) {
		return [arr[1], arr[0]];
	}

	throw new Error("A command should consist of 1 or 2 words.");
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
	return `${source.path}/${slug}` as PartialScriptPath;
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

	return `${directory}/${slug}` as PartialScriptPath;
}

export async function create(command: string) {
	const existingScript = await search(command);
	if (existingScript) {
		const { file } = existingScript;
		if (await Bun.file(file).exists()) {
			console.log(`${ansis.bold(command)} already exists:`, `\n`, `-> ${file}`);

			if (
				ack(`Would you like to edit ${ansis.bold(command)} ?`, "y")
			) {
				return await openEditor(file);
			}
			return true;
		}
	}

	const [slug, namespace] = commandFromStr(command);
	const partialPath = namespace
		? await namespacedScriptPath(slug, namespace)
		: await scriptPath(slug);

	const extension = await get("extension", "ts");
	const script = {
		slug: slug,
		path: `${partialPath}.${extension}`,
	}

	console.log(ansis.dim(`Creating new script: ${script.path}`));
	if (!ack(`Create new command "${ansis.bold(command)}"?`)) {
		process.exit(0);
	}

	if (!namespace) {
		const binFile = await ensureBin(script);
		if (binFile) {
			await $`chmod +x ${binFile}`;
		} else {
			console.log(`\n${ansis.red("▲")} Could not create a symlink to the script.`);
			return false;
		}
	}

	await openEditor(script.path);
	return script.path;
}