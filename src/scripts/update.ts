import {getVersion} from './version';

export const name = 'update';
export const desc = 'Update bun-magic to the latest version';

export default async function update() {
	const cv = await getVersion();
	await $`bun update -g bun-magic`;
	const nv = await getVersion();
	if (cv === nv) {
		console.log('\nYou are already using the latest version of bun-magic.');
	} else {
		console.log(`\nUpdated bun-magic from ${cv} to ${nv}`);
	}
}
