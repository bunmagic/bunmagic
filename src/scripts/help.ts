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
	console.log(`\n  ${ansis.bold('Commands:')}`);

	columns.buffer();
	for (const [name, command] of commands.entries()) {
		if (('alias' in command && command.alias && command.alias.includes(name))) {
			continue;
		}

		if (Bun.file(command.file).name?.startsWith('_')) {
			continue;
		}

		if (command.type === 'command' || command.type === 'instant-script') {
			let description = command.desc || '';
			if (command.alias) {
				description += ansis.dim(` (alias: ${command.alias.join(', ')})`);
			}

			columns.log([
				ansis.bold(command.name),
				ansis.gray(command.usage || ''),
				description,
			]);
		}
	}

	columns.flushLog();
}
