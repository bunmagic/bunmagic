import { default as version } from './version';

export const name = "update";
export const desc = "Update bunism to the latest version";

export default async function update() {
	await $`bun update -g bunism`;
	console.log("Updated bunism to the latest version.");
	await version();
}