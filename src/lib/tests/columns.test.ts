import { expect, test } from 'bun:test';
import ansis from 'ansis';
import { Columns } from '../columns';
// Utility function to generate a string with sequential characters and spaces every few characters
function generateString(length: number, spaceEvery = 0): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	let charIndex = 0;
	for (let index = 0; index < length; index++) {
		if (index > 0 && index % spaceEvery === 0) {
			result += ' ';
		}

		result += characters.charAt(charIndex);
		charIndex = (charIndex + 1) % characters.length;
	}

	return result;
}

// Utility function to generate a row with specified column count, length, and space frequency
function generateRow(columns: number, length: number, spaceEvery: number): string[] {
	return Array.from({ length: columns }, () => generateString(length, spaceEvery));
}

// Utility function to generate whitespace of a specified length
type PaddedString = {
	size: number;
	get(ws?: number): string;
};
function pad(...data: string[] | Array<PaddedString>) {
	let input: string;
	if (typeof data === 'string') {
		input = data[0];
	} else {
		input = data.map(d => (typeof d === 'string' ? d : d.get())).join('');
	}

	return {
		size: data.length,
		get(ws: number = input.length) {
			return String(input) + ' '.repeat(ws - input.length);
		},
	};
}

function row(...columns: PaddedString[]): string[] {
	return columns.map(column => column.get());
}

function whitespace(length: number) {
	return ' '.repeat(length);
}

test('generateString - length and space frequency', () => {
	const length = 20;
	const spaceEvery = 5;
	const generated = generateString(length, spaceEvery);

	expect(generated.length).toBe(length + Math.floor((length - 1) / spaceEvery));
	expect(generated.split(' ').every(part => part.length <= spaceEvery)).toBe(true);
});

test('generateRow - column count, length, and space frequency', () => {
	const columns = 3;
	const length = 10;
	const spaceEvery = 4;
	const generated = generateRow(columns, length, spaceEvery);

	expect(generated.length).toBe(columns);
	expect(
		generated.every(column => column.length === length + Math.floor((length - 1) / spaceEvery)),
	).toBe(true);
	expect(
		generated.every(column => column.split(' ').every(part => part.length <= spaceEvery)),
	).toBe(true);
});

test('Two Columns', () => {
	const columns = new Columns(2, [20, 20]).buffer();
	const col1 = pad('Column 1');
	const col2 = pad('Column 2');
	columns.log(row(col1, col2));
	const result = columns.flush();
	expect(result).toBe(whitespace(2) + col1.get(20) + whitespace(2) + col2.get(20));
});

test('Three Columns', () => {
	const columns = new Columns(3, [20, 20, 20]).buffer();
	const col1 = pad('Column 1');
	const col2 = pad('Column 2');
	const col3 = pad('Very Long Column 3');
	columns.log(row(col1, col2, col3));
	const result = columns.flush();
	expect(result).toBe(
		whitespace(2) + col1.get(20) + whitespace(2) + col2.get(20) + whitespace(2) + col3.get(20),
	);
});

test('Two Columns with a manual line break', () => {
	const columns = new Columns(2, [20, 20]).buffer();
	const col1 = pad('Column 1');
	const col2 = pad('Column 2');
	const line2 = pad('Line 2');
	columns.log([col1.get(), col2.get() + '\n' + line2.get()]);
	const result = columns.flush();
	expect(result).toBe(
		whitespace(2) +
			col1.get(20) +
			whitespace(2) +
			col2.get(20) +
			'\n' +
			whitespace(2) +
			whitespace(20) +
			whitespace(2) +
			line2.get(20),
	);
});

test('Two Columns with a line wrap', () => {
	const columns = new Columns(2, [10, 10]).buffer();
	const col1 = pad('ABCDEFGHIJ');
	const col2l1 = pad('1234567890');
	const col2l2 = pad('__________');
	columns.log(row(col1, pad(col2l1, col2l2)));
	const result = columns.flush();

	expect(result).toBe(
		whitespace(2) +
			col1.get() +
			whitespace(2) +
			col2l1.get() +
			'\n' +
			whitespace(2 + 10 + 2) +
			col2l2.get(10),
	);
});

test('2 columns, 2 rows', () => {
	const columns = new Columns(2, [10, 20]).buffer();
	const twenty = 'x'.repeat(20);
	const thirty = 'o'.repeat(30);
	const col1 = pad(twenty);
	const col2 = pad(thirty);

	columns.log(row(col1, col2));
	const result = columns.flush();

	expect(result).toBe(
		whitespace(2) +
			'x'.repeat(10) +
			whitespace(2) +
			'o'.repeat(20) +
			'\n' +
			whitespace(2) +
			'x'.repeat(10) +
			whitespace(2) +
			'o'.repeat(10) +
			whitespace(10),
	);
});

test('give up on columns if the terminal is too narrow and content too wide', () => {
	process.stdout.columns = 10;
	const columns = new Columns(2, [10, 'auto']).buffer();
	const twenty = 'x'.repeat(10);
	const thirty = 'o'.repeat(30);
	const col1 = pad(twenty);
	const col2 = pad(thirty);
	columns.log(row(col1, col2));
	const result = columns.flush();
	expect(ansis.strip(result)).toBe(
		'x'.repeat(10) + '\n' + 'o'.repeat(30) + `\n${'┈'.repeat(process.stdout.columns)}\n`,
	);
});
