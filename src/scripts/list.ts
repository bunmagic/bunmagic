/**
 * List all known scripts.
 * @usage [[filter]]  Optional that fuzzy matches sources paths.
 * @alias ls
 * @flag [[--info|-i]] Display more information about each script.
 */
import path from 'node:path';
import { getSources } from '@lib/sources';
import ansis from 'ansis';
import { displayScriptInfo, setupScriptColumns } from '@lib/display-utils';
import fuzzysort from 'fuzzysort';

async function getSourcesToDisplay(target?: string) {
	const sources = await getSources();

	if (!target) {
		return sources;
	}

	const results = fuzzysort.go(target, sources, {
		keys: ['dir', 'namespace'],
	});

	return results.map(r => r.obj);
}

export default async function listScripts() {
	const target = args[0];
	const sources = await getSourcesToDisplay(target);

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

			if (sources.length === 1 || flags.i || flags.info) {
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
