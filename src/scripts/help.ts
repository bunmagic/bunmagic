import type {
	Command, NotFound, InstantScript,
} from '@lib/commands';

export const name = 'help';
export const desc = 'Get the full list of available commands';

type GrowToSize<T, N extends number, A extends T[]> =
  A['length'] extends N ? A : GrowToSize<T, N, [...A, T]>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type FixedArray<T, N extends number> = GrowToSize<T, N, []>;

class Columns<T extends number, Row extends string | FixedArray<string, T>> {
	public indent = 2;
	public gap = 2;
	private readonly rows: Row[] = [];

	constructor(private readonly columnCount: T) {}

	log(data: Row) {
		this.rows.push(data);
	}

	render() {
		const columnWidths = this.getColumnWidths();
		let output = '';
		for (const row of this.rows) {
			output += '\n';

			if (this.indent > 0) {
				output += ' '.repeat(this.indent);
			}

			if (typeof row === 'string') {
				output += row;
			}

			if (Array.isArray(row)) {
				for (const [index, text] of (row as string[]).entries()) {
					const width = columnWidths[index] - ansis.strip(text).length;

					if (this.gap > 0 && index > 0 && index < this.columnCount) {
						output += ' '.repeat(this.gap);
					}

					output += text;
					output += ' '.repeat(width);
				}
			}
		}

		return output;
	}

	private getColumnWidths(): number[] {
		const rows = this.rows.filter(row => typeof row !== 'string') as string[][];
		const widths = Array.from({length: this.columnCount}, () => 0);
		for (const row of rows) {
			for (let index = 0; index < this.columnCount; index++) {
				if (!(index in row)) {
					continue;
				}

				const column = ansis.strip(row[index]);
				if (column.length > widths[index]) {
					widths[index] = column.length;
				}
			}
		}

		return widths;
	}
}
export default async function (commands: Map<string, Command | NotFound | InstantScript>) {
	const columns = new Columns(3);
	columns.gap = 5;

	console.log(`\n  ${ansis.bold.yellow('Bunmagic')}\n  ${ansis.dim('Poof! Your buns are now magical.')}`);
	console.log(`\n  ${ansis.bold('Usage:')} ${ansis.bold.yellowBright('bunmagic')} ${ansis.dim('<command>')} ${ansis.dim('[arguments]')}`);
	console.log(`\n  ${ansis.bold('Commands:')}`);

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

	console.log(columns.render());
}
