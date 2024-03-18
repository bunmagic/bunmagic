type ColumnConfig = 'auto' | '' | number | `${number}%`;

function fixedLengthArray<T>(length: number, fill: T): T[] {
	return Array.from({ length }, () => fill);
}

export class Columns<T extends number, Row extends string | string[]> {
	public indent = 2;
	public gap = 2;
	private readonly rows: Row[] = [];
	private isBuffering = false;

	constructor(
		private readonly columnCount: T,
		private readonly config: ColumnConfig[] = fixedLengthArray(columnCount, 'auto'),
	) {}

	public log(data: Row) {
		if (typeof data === 'string') {
			this.rows.push(data);
		} else {
			const lines = data.map(column => column.split('\n'));
			for (let index = 0; index < Math.max(...lines.map(l => l.length)); index++) {
				const row = lines.map(line => {
					if (line[index] === undefined) {
						return '';
					}

					let content = line[index];
					if (index > 0) {
						// Preserve control characters (ansi colors, etc.), but remove leading tabs.
						// Still allow for leading spaces to allow intentional custom indentation.
						// eslint-disable-next-line no-control-regex
						content = content.replaceAll(/^(\u001B\[[\d;]*m)*\t+/g, '$1');
					}

					return content;
				});
				// Push the row to the rows array
				this.rows.push(row as Row);
			}
		}

		if (!this.isBuffering) {
			console.log(this.render());
			this.rows.length = 0;
		}

		return this;
	}

	public buffer() {
		this.isBuffering = true;
		return this;
	}

	public flush() {
		this.isBuffering = false;
		const result = this.render();
		this.rows.length = 0;
		return result;
	}

	public flushLog() {
		this.isBuffering = false;
		console.log(this.render());
		this.rows.length = 0;
	}

	public render() {
		const rows: string[] = [];
		for (const row of this.rows) {
			let output = '';
			if (typeof row === 'string') {
				if (this.indent > 0) {
					output += ' '.repeat(this.indent);
				}

				output += row;
			}

			if (Array.isArray(row)) {
				output += this.renderRow(row);
			}

			rows.push(output);
		}

		return rows.join('\n');
	}

	private nearestWrap(content: string, before: number, maxRangeWords = 2): number {
		const sentenceEnds = new Set(['.', '!', '?']);
		let lastFoundIndex = -1;
		let wordCount = 0;

		// Iterate backwards from the 'before' position to find a sentence end or a suitable space
		for (let index = before; index >= 0 && wordCount <= maxRangeWords; index--) {
			const char = content[index];

			// Check if the character is a sentence end
			if (sentenceEnds.has(char) && content[index + 1] === ' ') {
				return index + 2; // Return position to start after the sentence end and the following space
			}

			// Check if the character is a space, indicating a word boundary
			if (char === ' ') {
				wordCount++;
				lastFoundIndex = index; // Update the last found space index
			}
		}

		// If a suitable space was found within the maxRangeWords limit, return its position + 1
		if (lastFoundIndex !== -1) {
			return lastFoundIndex + 1; // Return position to start after the space
		}

		// If no suitable wrapping point was found, return the original position
		return before;
	}

	private calculateColumnWidths() {
		const autoWidths = this.getColumnWidths();
		const maxCols = (process.stdout.columns || 80) - this.indent;

		const widths = Array.from({ length: this.columnCount }, () => 0);
		// Loop over the automatically set widths
		for (let [index, width] of autoWidths.entries()) {
			const config = this.config[index];


			// If the column is set to auto or an empty string, skip it
			if (config === 'auto' || config === '') {
				widths[index] = width;
			}

			// Calculate the percentage width
			if (typeof config === 'string' && config.endsWith('%')) {
				const percentage = Number(config.slice(0, -1));
				width = Math.floor(maxCols * (percentage / 100));
			}

			if (typeof config === 'number') {
				width = config;
			}

			// Make sure that the column can fit
			if (width > maxCols) {
				width = Math.floor(maxCols / this.columnCount);
			}

			widths[index] = width;
		}


		const totalGap = this.indent + (this.gap * (this.columnCount - 1));
		const totalWidth = widths.reduce((accumulator, width) => accumulator + width, 0) + totalGap;

		if (totalWidth > maxCols) {
			const maxWidth = Math.max(...widths);
			const maxWidthIndex = widths.indexOf(maxWidth);
			const adjustment = totalWidth - maxCols;
			widths[maxWidthIndex] = maxWidth - adjustment;
		}

		return widths;
	}

	private renderRow(columns: string[]) {
		let output = '';
		if (this.indent > 0) {
			output += ' '.repeat(this.indent);
		}

		for (const [column, content] of (columns).entries()) {
			if (this.gap > 0 && column > 0 && column <= this.columnCount) {
				output += ' '.repeat(this.gap);
			}

			const widths = this.calculateColumnWidths();
			const widthLimit = widths[column];
			const contentWidth = ansis.strip(content).length;
			if (contentWidth > widthLimit) {
				const wrapAt = this.nearestWrap(content, widthLimit, 1);
				const wrappedContent = content.slice(0, wrapAt);
				output += wrappedContent;
				output += '\n';

				const remainingContent = content.slice(wrapAt);
				const columnsLeft = column;
				const columnsRight = this.columnCount - column - 1;
				const columnsToWrap = [
					...fixedLengthArray(columnsLeft, ''),
					remainingContent,
					...fixedLengthArray(columnsRight, ''),
				];
				output += this.renderRow(columnsToWrap) + '\n';
			} else {
				const width = widthLimit - contentWidth;
				output += content;
				output += ' '.repeat(width);
			}
		}

		return output;
	}

	private getColumnWidths() {
		const rows = this.rows.filter(row => typeof row !== 'string') as string[][];
		const widths = Array.from({ length: this.columnCount }, () => 0);
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
