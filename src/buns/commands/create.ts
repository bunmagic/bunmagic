import {
	search,
	getSourceDirectories,
	scriptInfo
} from "../sources";
import { makeScriptExecutable } from "../bins";
import { openEditor } from "./edit";
import { get } from '../config';

export const desc = `Create a new script`;
export const usage = `bunshell create <script-name>`;
export const alias = ["new"];

export default async function () {
	const slug = argv._[0];
	if (!slug) {
		throw new Error('Scripts must have a name.');
	}
	return await create(slug);
}

export async function create(slug: string) {
	const script = await search(slug);
	if (script) {
		const { file, bin } = script;
		if (await fs.pathExists(file)) {
			console.log(`${chalk.bold(slug)} already exists:`, `\n`, `-> ${file}`);

			if (
				ack(`Would you like to edit ${chalk.bold(slug)} ?`, "y")
			) {
				return await openEditor(file);
			}
			return true;
		}
	}

	const commandExists = await $`which ${slug}`;

	if (commandExists.exitCode !== 1) {
		const alias = await $`which ${slug}`.text();
		console.log(
			`Command "${chalk.bold(slug)}" is already aliased to "${alias.trim()}"\n`,
		);
		process.exit(1);
	}

	if (!ack(`Create new command "${chalk.bold(slug)}"?`)) {
		process.exit(0);
	}

	console.log("Creating a new command: " + slug);

	const directories = await getSourceDirectories().then(d => [...d].map(d => d.path));
	let directory = directories[0];

	if (directories.length > 1) {
		directory = selection(directories, `Which directory to use?`);
	}

	if (!directory) {
		throw new Error("No directory selected");
	}

	const extension = await get("extension", "ts");
	const scriptFile = scriptInfo(`${directory}/${slug}.${extension}`);

	await $`chmod +x ${scriptFile.file}`;

	await makeScriptExecutable(scriptFile)
	await openEditor(slug)

	return scriptFile.file;
}