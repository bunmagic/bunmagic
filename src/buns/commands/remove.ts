import { search } from "../sources";

export const desc = `Remove and unlink a script`;
export const usage = `bunshell remove <script-name>`;
export const alias = ["rm"];

export default async function run() {
	const slug = argv._[0];

	if (!slug) {
		throw new Error(
			`You must specify which script to remove.\n${info.usage}`,
		);
	}

	const { file, bin } = await search(slug);

	if (!file && !bin) {
		console.log(`🍀 You're in luck! ${slug} doesn't exist already!`);
		return;
	}

	if (false === (ack(`Delete command "${chalk.bold(slug)}"?`))) {
		return false;
	}

	await $`rm ${file}`;
	await $`rm ${bin}`;
}