
type GrowToSize<T, N extends number, A extends T[]> =
  A['length'] extends N ? A : GrowToSize<T, N, [...A, T]>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type FixedArray<T, N extends number> = GrowToSize<T, N, []>;

export class Columns<T extends number, Row extends string | FixedArray<string, T>> {
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
