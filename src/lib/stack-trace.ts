import path from 'node:path';

export function findCallerScriptPath(stack: string[], bunmagicRoot: string): string | undefined {
	const root = path.resolve(bunmagicRoot);
	let internalScript: string | undefined;
	for (const line of stack) {
		if (!line || line === 'Error') {
			continue;
		}

		const withParens = line.match(/\((.+?):\d+:\d+\)/);
		const withoutParens = line.match(/at (.+?):\d+:\d+/);
		const match = withParens ?? withoutParens;
		if (!match || !match[1]) {
			continue;
		}

		const rawPath = match[1];
		if (
			rawPath === 'native' ||
			rawPath.startsWith('node:') ||
			rawPath.startsWith('internal') ||
			rawPath.startsWith('bun:')
		) {
			continue;
		}

		const normalizedPath = rawPath.replace('file://', '');
		const resolved = path.resolve(normalizedPath);
		if (resolved.startsWith(root)) {
			if (!internalScript && resolved.includes(`${path.sep}scripts${path.sep}`)) {
				internalScript = resolved;
			}
			continue;
		}
		return resolved;
	}

	return internalScript;
}
