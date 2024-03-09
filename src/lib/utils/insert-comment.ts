import parser from 'comment-parser';

function transform(content: string) {
	const updatedParsed = parser.parse(content);
	const transform = parser.transforms.flow(parser.transforms.align(), parser.transforms.indent(0));
	return parser.stringify(transform(updatedParsed[0]));
}

export async function insertCommentLine(contents: string, line: string) {
	let lines = transform(contents).split('\n');
	if (lines.length === 1) {
		const content = lines[0].replace(/\/\*\*(.*)\*\//, '$1');
		lines = [
			'/**',
			` * ${content}`,
			' * @url example.com',
			' */',
		];
	} else {
		lines = lines.slice(0, -2);
		lines.push(line, ' */');
	}

	return transform(lines.join('\n'));
}

const contents = await Bun.file(import.meta.path).text();
const line = `@url example.com`;
console.log(await insertCommentLine(contents, line));
