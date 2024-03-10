import * as parser from 'comment-parser';

export function transform(content: string) {
	const updatedParsed = parser.parse(content);
	const transform = parser.transforms.flow(parser.transforms.indent(1));
	return parser.stringify(transform(updatedParsed[0])).trim();
}

export async function insertCommentLine(contents: string, insert: string) {
	if (!contents.trim()) {
		return `/**\n * ${insert.trim()}\n */\n`;
	}

	let lines = transform(contents).split('\n');
	if (lines.length === 1) {
		const content = lines[0].replace(/\/\*{2}(.*?)\*{1,2}\//i, '$1');
		lines = [
			'/**',
			` * ${content.trim()}`,
			` * ${insert.trim()}`,
			' */',
		];
	} else {
		lines = lines.slice(0, -1);
		lines.push(`* ${insert.trim()}`, '*/');
	}

	return transform(lines.map(l => l.trim()).join('\n'));
}

