/**
 * Get the full list of available commands.
 */
import { Columns } from '@lib/columns';
import type { Script } from '@lib/script';

export default async function (scripts: Map<string, Script>) {
	const columns = new Columns(3);
	columns.gap = 5;

	console.log(`\n  ${ansis.bold.yellow('Bunmagic')}\n  ${ansis.dim('Poof! Your buns are now magical.')}`);
	console.log(`\n  ${ansis.bold('Usage:')} ${ansis.bold.yellowBright('bunmagic')} ${ansis.dim('<command>')} ${ansis.dim('[arguments]')}`);


	columns.buffer();
	columns.log('');
	columns.log(['script', 'args', 'description'].map(s => ansis.dim(s)) as [string, string, string]);
	columns.log(['------', '----', '-----------'].map(s => ansis.dim(s)) as [string, string, string]);
	for (const [name, script] of scripts.entries()) {
		if (script.type !== 'script') {
			continue;
		}

		if (script.alias.includes(name)) {
			continue;
		}

		if (Bun.file(script.source).name?.startsWith('_')) {
			continue;
		}

		let description = script.desc || '';
		if (script.alias.length > 0) {
			description += ansis.dim(` (alias: ${script.alias.join(', ')})`);
		}

		columns.log([
			ansis.bold(script.slug),
			ansis.gray(script.usage || ''),
			description,
		]);
	}

	columns.flushLog();
}
