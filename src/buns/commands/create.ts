import {
	binfo,
	search,
	getSourceDirectories,
	scriptInfo,
	addSourceDirectory,
	getScripts,
} from "../sources";
import { getBins, relinkBins, makeScriptExecutable } from "../bins";
import { PATHS, get, update as updateConfig } from "../config";
import { version } from "../github";

commandInfo.create = {
	desc: `Create a new script`,
	usage: `bunshell create <script-name>`,
};
async function create(slug?: string) {

	if (!slug) {
		throw new Error(
			`Scripts must have a name.\n${commandInfo.create.usage}`,
		);
	}

	const script = await search(slug);
	if (!script) {
		return true;
	}

	const { file, bin } = script;

	if (await fs.pathExists(file)) {
		console.log(`${chalk.bold(slug)} already exists:`, `\n`, `-> ${file}`);

		if (
			ack(`Would you like to edit ${chalk.bold(slug)} ?`, "y")
		) {
			return await edit(slug);
		}
		return true;
	}

	const commandExists = await $`which ${slug}`;

	if (commandExists.exitCode !== 1) {
		const alias = await $`which ${slug}`.text();
		console.log(
			`Command "${chalk.bold(slug)}" is already aliased to "${alias.trim()}"\n`,
		);
		process.exit(1);
	}

	if (
		false === (ack(`Create new command "${chalk.bold(slug)}"?`))
	) {
		process.exit(0);
	}

	console.log("Creating a new command: " + slug);

	const directories = [...getSourceDirectories()];
	let directory = directories[0];

	if (directories.length > 1) {
		directory = await selection(directories, `Which directory to use?`);
	}

	if (!directory) {
		throw new Error("No directory selected");
	}

	const info = scriptInfo(`${directory}/${slug}.mjs`);

	await $`echo '#!/usr/bin/env zx' >> ${info.file}`;
	await $`chmod +x ${info.file}`;

	await makeScriptExecutable(info)
	await edit(slug)

	return info.file;
}