
export async function isMacOS() {
	return process.platform === 'darwin';
}

export async function copyToClipboard(text: string) {
	if (await isMacOS()) {
		await $`printf '%s' "${text}" | pbcopy`;
	}
}
