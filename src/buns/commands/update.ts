import { PATHS, get, update as updateConfig } from "../config";
import { version } from "../github";

export const name = `update`;
export const desc = `Update bunshell from GitHub`;
export const usage = `bunshell update`;

export default async function run() {
	const latestVersion = await version();
	const currentVersion = await get("version");

	if (latestVersion === currentVersion) {
		console.log(
			`${latestVersion} is the latest version! You're up to date.`,
		);
		return;
	}

	const confirmUpdate = `Your version:		${chalk.bold(currentVersion)}\nLatest on GitHub:	${chalk.bold(latestVersion)}\nUpdate? `;
	if (
		currentVersion &&
		currentVersion !== latestVersion &&
		false === (ack(confirmUpdate, "y"))
	) {
		return;
	}

	console.log("\nUpdating...");
	cd(`${PATHS.bunshell}/inc`);
	const result = await $`zx install.mjs --update`;
	if (result.exitCode !== 0) {
		throw new Error(result);
	}
	updateConfig("version", latestVersion);
	console.log("Done!");
}