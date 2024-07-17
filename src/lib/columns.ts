import ansis from 'ansis';

type ColumnConfig = 'auto' | '' | number | `${number}%`;

function fixedLengthArray<T>(length: number, fill: T): T[] {
	return Array.from({ length }, () => fill);
}

export class Columns<T extends number = number, Row extends string | string[] = string | string[]> {
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
		const widths = this.fitWidths(this.calculateColumnWidths());
		for (const row of this.rows) {
			let output = '';

			if (typeof row === 'string') {
				if (this.indent > 0) {
					output += ' '.repeat(this.indent);
				}

				output += row;
			}

			if (Array.isArray(row)) {
				output += this.renderRow(row, widths);
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
		for (const [index, width] of autoWidths.entries()) {
			const config = this.config[index];

			// If the column is set to auto or an empty string, skip it
			if (config === 'auto' || config === '') {
				widths[index] = width;
				continue; // Skip further processing
			}

			// Calculate the percentage width
			if (typeof config === 'string' && config.endsWith('%')) {
				const percentage = Number(config.slice(0, -1));
				widths[index] = Math.floor(maxCols * (percentage / 100));
			} else if (typeof config === 'number') {
				widths[index] = config;
			}

			// Make sure that the column can fit
			if (width > maxCols) {
				widths[index] = Math.floor(maxCols / this.columnCount);
			}

			widths[index] = width;
		}

		return widths;
	}

	private fitWidths(widths: number[]): number[] {
		const adjustedWidths = [...widths];
		const maxCols = (process.stdout.columns || 80) - this.indent;
		const availableWidth = maxCols - (this.gap * (this.columnCount - 1));

		// Calculate the total width of fixed and percentage columns
		let fixedWidth = 0;
		let percentageWidth = 0;
		for (let index = 0; index < this.columnCount; index++) {
			const config = this.config[index];
			if (typeof config === 'number') {
				adjustedWidths[index] = Math.min(config, availableWidth);
				fixedWidth += adjustedWidths[index];
			} else if (typeof config === 'string' && config.endsWith('%')) {
				const percentage = Number(config.slice(0, -1));
				const columnWidth = Math.floor(availableWidth * (percentage / 100));
				adjustedWidths[index] = columnWidth;
				percentageWidth += columnWidth;
			}
		}

		// Distribute the remaining width among 'auto' columns based on their content width
		const remainingWidth = availableWidth - fixedWidth - percentageWidth;
		const autoColumnIndices = this.config.map((config, index) => (config === 'auto' || config === '') ? index : -1).filter(index => index !== -1);
		let distributedWidth = 0;
		for (const columnIndex of autoColumnIndices) {
			const contentWidth = widths[columnIndex];
			if (distributedWidth + contentWidth <= remainingWidth) {
				adjustedWidths[columnIndex] = contentWidth;
				distributedWidth += contentWidth;
			} else {
				adjustedWidths[columnIndex] = remainingWidth - distributedWidth;
				break;
			}
		}

		// Distribute any remaining width equally among the remaining 'auto' columns
		const remainingAutoWidth = remainingWidth - distributedWidth;
		const remainingAutoColumns = autoColumnIndices.filter(index => adjustedWidths[index] === 0);
		const equalWidth = Math.floor(remainingAutoWidth / remainingAutoColumns.length);
		for (const columnIndex of remainingAutoColumns) {
			adjustedWidths[columnIndex] = equalWidth;
		}

		return adjustedWidths;
	}

	private renderRow(columns: string[], widths: number[]): string {
		let row = '';
		const leftovers = Array.from({ length: columns.length }, () => '');

		// If the terminal isn't wide enough - give up on column
		const widthSum = widths.reduce((sum, width) => sum + width, 0);
		const columnSum = this.calculateColumnWidths().reduce((sum, width) => sum + width, 0);
		if (widths.some(value => value <= 0) || widthSum / columnSum <= 0.48) {
			return `${columns.join('\n')}\n${ansis.dim('┈'.repeat(process.stdout.columns || 80))}\n`;
		}

		for (const [column, content] of columns.entries()) {
			const widthLimit = widths[column];
			const contentWidth = ansis.strip(content).length;
			const trailingGap = column === this.columnCount - 1 ? '' : ' '.repeat(this.gap);

			if (contentWidth > widthLimit) {
				const rawContent = ansis.strip(content);
				const rawContentPos = content.indexOf(rawContent);

				// Attempt to preserve color codes for fully colored entries
				if (rawContent !== content && rawContentPos > 0) {
					const colorCode = content.slice(0, rawContentPos);
					const resetCode = content.slice(content.lastIndexOf(rawContent) + rawContent.length + colorCode.length);
					const wrapAt = this.nearestWrap(rawContent, widthLimit, 1);
					const visibleContent = rawContent.slice(0, wrapAt);
					const remainingContent = rawContent.replace(visibleContent, '');

					leftovers[column] = `${colorCode}${remainingContent}${resetCode}`;
					row += `${visibleContent}${trailingGap}${resetCode}`;
				} else {
					// If no color codes are found, just split the content
					const wrapAt = this.nearestWrap(content, widthLimit, 1);
					const visibleContent = content.slice(0, wrapAt);
					const remainingContent = content.replace(visibleContent, '');
					leftovers[column] = remainingContent;
					row += `${visibleContent}${trailingGap}`;
				}
			} else {
				row += `${content}${' '.repeat(widthLimit - contentWidth)}${trailingGap}`;
			}
		}

		if (leftovers.some(content => content.trim() !== '')) {
			// console.log(`Content ${row}`, `Leftovers`, {leftovers, widths});
			const result = this.renderRow(leftovers, widths);
			if (result.trim() !== '') {
				row += `\n${result}`;
			}
		}

		return `${' '.repeat(this.indent)}${row}`;
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

