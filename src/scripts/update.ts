import {getVersion} from './version';

export const name = 'update';
export const desc = 'Update bunism to the latest version';

export default async function update() {
	const cv = await getVersion();
	await $`bun update -g bunism`;
	const nv = await getVersion();
	if (cv === nv) {
		console.log('\nYou are already using the latest version of bunism.');
	} else {
		console.log(`\nUpdated bunism from ${cv} to ${nv}`);
	}
}
