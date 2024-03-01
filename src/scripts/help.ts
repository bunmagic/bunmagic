import {Columns} from '@lib/columns';
import type {
	Command, NotFound, InstantScript,
} from '@lib/commands';

export const name = 'help';
export const desc = 'Get the full list of available commands';

export default async function (commands: Map<string, Command | NotFound | InstantScript>) {
	const columns = new Columns(3);
	columns.gap = 5;

	console.log(`\n  ${ansis.bold.yellow('Bunmagic')}\n  ${ansis.dim('Poof! Your buns are now magical.')}`);
	console.log(`\n  ${ansis.bold('Usage:')} ${ansis.bold.yellowBright('bunmagic')} ${ansis.dim('<command>')} ${ansis.dim('[arguments]')}`);


	columns.buffer();
	columns.log('');
	columns.log(['command', 'args', 'description'].map(s => ansis.dim(s)) as [string, string, string]);
	columns.log(['-------', '----', '-----------'].map(s => ansis.dim(s)) as [string, string, string]);
	for (const [name, command] of commands.entries()) {
		if (('alias' in command && command.alias && command.alias.includes(name))) {
			continue;
		}

		if (command.type !== 'not-found' && Bun.file(command.source).name?.startsWith('_')) {
			continue;
		}

		if (command.type === 'command' || command.type === 'instant-script') {
			let description = command.desc || '';
			if (command.alias) {
				description += ansis.dim(` (alias: ${command.alias.join(', ')})`);
			}

			columns.log([
				ansis.bold(command.slug),
				ansis.gray(command.usage || ''),
				description,
			]);
		}
	}

	columns.flushLog();
}
