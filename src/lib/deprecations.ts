const warnedDeprecations = new Set<string>();

export function warnDeprecationOnce(key: string, message: string) {
	if (process.env.BUNMAGIC_SILENCE_DEPRECATIONS === '1') {
		return false;
	}

	if (warnedDeprecations.has(key)) {
		return false;
	}

	warnedDeprecations.add(key);
	console.warn(message);
	return true;
}
