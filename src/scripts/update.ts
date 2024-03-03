import { getVersion } from './version';

export const name = 'update';
export const desc = 'Update bunmagic to the latest version';

export default async function update() {
	const cv = await getVersion();
	await $`bun update -g bunmagic`;
	const nv = await getVersion();
	if (cv === nv) {
		console.log('\nYou are already using the latest version of bunmagic.');
	} else {
		console.log(`\nUpdated bunmagic from ${cv} to ${nv}`);
	}
}
