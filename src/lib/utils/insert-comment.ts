import * as parser from 'comment-parser';

function transform(content: string) {
	const updatedParsed = parser.parse(content);
	const transform = parser.transforms.flow(parser.transforms.align(), parser.transforms.indent(0));
	return parser.stringify(transform(updatedParsed[0]));
}

export async function insertCommentLine(contents: string, insert: string) {
	let lines = transform(contents).split('\n');
	if (lines.length === 1) {
		const content = lines[0].replace(/\/\*{2}(.*?)\*{1,2}\//i, '$1');
		lines = [
			'/**',
			` * ${content}`,
			` * ${insert}`,
			' */',
		];
	} else {
		lines = lines.slice(0, -1);
		lines.push(`* ${insert}`, '*/');
	}

	return transform(lines.map(l => l.trim()).join('\n'));
}

