import { default as version } from './version';

export const name = "update";
export const desc = "Update bunshell to the latest version";

export default async function update() {
	await $`bun update -g bunshell/bunshell`;
	console.log("Updated bunshell to the latest version.");
	await version();
}