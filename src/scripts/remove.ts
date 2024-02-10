import { PATHS, update, type Config } from '../lib/config';
import { commandFromStr, getSources, search } from "../lib/sources";


export const desc = `Remove and unlink a script`;
export const usage = `bunism remove <script-name>`;
export const alias = ["rm"];

async function removeNamespace(namespace: string) {
	const sources = await getSources();
	const source = sources.find((dir) => dir.namespace === namespace);
	if (!source) {
		throw new Error(`Namespace "${namespace}" not found`);
	}
	if (false === (ack(`Unlink namespace "${ansis.bold(namespace)}"?`))) {
		return false;
	}
	await update("sources", sources.filter((dir) => dir.namespace !== namespace) as (Config["sources"]));
}

export default async function () {
	const input = argv._.join(" ");
	const [command, namespace] = commandFromStr(input);
	if (!command) {
		throw new Error(
			`You must specify which script to remove.\n${usage}`,
		);
	}

	const script = await search(input);
	if (!script) {
		try {
			await removeNamespace(input)
		} catch (e) {
			console.log(`Can't find a namespace or a script with the name "${input}".`);
		}
		return;
	}
	const { file } = script;

	if (false === (ack(`Delete command "${ansis.bold(input)}"?`))) {
		return false;
	}

	if (!namespace) {
		const binFile = path.join(PATHS.bins, input);
		if (!file && !binFile) {
			console.log(`🍀 You're in luck! ${input} doesn't exist already!`);
			return;
		}
		await $`rm ${binFile}`;
	}

	await $`rm ${file}`;
}