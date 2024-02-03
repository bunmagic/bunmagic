import { PATHS } from '../lib/config';
import { search } from "../lib/sources";
import { commandFromStr } from './create';

export const desc = `Remove and unlink a script`;
export const usage = `bunshell remove <script-name>`;
export const alias = ["rm"];

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
		console.log(`The script "${input}" doesn't exist.`);
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