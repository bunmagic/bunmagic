import { search } from "../sources";

commandInfo.remove = {
	desc: `Remove and unlink a script`,
	usage: `bunshell remove <script-name>`,
};
async function remove(slug) {
	if (!slug) {
		throw new Error(
			`You mus specify which script to remove.\n${commandInfo.remove.usage}`,
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