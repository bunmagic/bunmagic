import { PATHS, update, type Config, type Namespace } from '../lib/config';
import { commandFromStr, getSources, findNamespace, findScript } from "../lib/sources";


export const desc = `Remove and unlink a script`;
export const usage = `bunism remove <script-name>`;
export const alias = ["rm"];

async function removeNamespace(query: string) {
	const source = await findNamespace(query);
	if (!source) {
		throw new Error(`Namespace "${query}" not found`);
	}
	if (true !== ack(`Unlink namespace "${ansis.bold(query)}"?`)) {
		return false;
	}
	const sources = await getSources();
	const updatedSources = sources.filter((dir): dir is Namespace => 'namespace' in dir && dir.namespace !== source.namespace);
	// @TODO: The type doesn't complain, but the type is incorrect. I'm updating both scripts and namespaces.
	await update("sources", updatedSources);
}

export default async function () {

	if (argv._.length === 0) {
		throw new Error(
			`You must specify which script to remove.\n${usage}`,
		);
	}

	const input = argv._.join(" ");
	const script = await findScript(input);

	if (!script) {
		try {
			await removeNamespace(input)
		} catch (e) {
			console.log(`Can't find a namespace or a script with the name "${input}".`);
		}
		return;
	}

	if (false === (ack(`Delete command "${ansis.bold(input)}"?`))) {
		return false;
	}


	const binFile = path.join(PATHS.bins, script.file);
	console.log(script);
	const binFileExists = await Bun.file(binFile).exists();
	const sourceFileExists = await Bun.file(script.file).exists();

	if (binFileExists) {
		await $`rm ${binFile}`;
		return;
	}

	if (sourceFileExists && ack(`Remove the source file?`)) {
		await $`rm ${script.file}`;
	}

	if (!binFileExists && !sourceFileExists) {
		console.log(`🍀 You're in luck! "${input}" doesn't exist already!`);
	}
}