import { default as version } from './version';

export const name = "update";
export const desc = "Update bunism to the latest version";

export default async function update() {
	const cv = await version();
	await $`bun update -g bunism`;
	const nv = await version();
	if (cv !== nv) {
		console.log(`\nUpdated bunism from ${cv} to ${nv}`);
	} else {
		console.log(`\nYou are already using the latest version of bunism.`);
	}
}