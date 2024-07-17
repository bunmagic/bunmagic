/**
 * List all known scripts.
 * @alias ls
 */
import path from 'node:path';
import { getSources } from '@lib/sources';
import ansis from 'ansis';
import { displayScriptInfo, setupScriptColumns } from '@lib/display-utils';

export default async function listScripts() {
	const target = args[0] || null;
	const sources = await getSources();

	for (const source of sources) {
		const basename = path.basename(source.dir);
		const name = basename.charAt(0).toUpperCase() + basename.slice(1);

		const columns = setupScriptColumns();
		columns.log('');
		columns.log(ansis.gray.dim('–').repeat(process.stdout.columns * 0.8));
		columns.log('');
		columns.log(`${ansis.yellow.bold('◈ ' + name)}: ${ansis.dim.yellow(source.dir)}`);

		for (const script of source.scripts) {
			if (script.slug.startsWith('_')) {
				continue;
			}

			let hasBinaryFile = Bun.which(script.bin) !== null;

			// Check for namespaced scripts
			if (!hasBinaryFile && source.namespace) {
				const parentBin = source.namespace;
				hasBinaryFile = Bun.which(parentBin) !== null;
			}

			const symbol = hasBinaryFile ? ansis.bold.green('·') : ansis.bold.red('x');
			const displaySlug = source.namespace ? `${source.namespace} ${script.slug}` : script.slug;
			const formattedSlug = `${symbol} ${displaySlug}`;

			if (target && (script.slug === target || script.alias.includes(target))) {
				displayScriptInfo(columns, {
					...script,
					slug: formattedSlug,
					filename: script.filename,
					dir: source.dir,
				});
			} else {
				columns.log([
					ansis.bold(formattedSlug),
					script.desc || '',
				]);
			}

			if (!hasBinaryFile) {
				columns.log(['', ansis.red('▲ script executable missing')]);
			}
		}

		columns.flushLog();
	}
}
