// let parser: CommentParser;
import { type parse as Parser } from 'comment-parser';

async function readFirstComment(filePath: string) {
	const file = Bun.file(filePath);
	const buffer = await file.arrayBuffer();
	const view = new Uint8Array(buffer);

	const STAR = 42;
	const SLASH = 47;
	let start = -1;
	let end = -1;

	for (let index = 0; index < view.length - 2; index++) {
		if (view[index] === SLASH && view[index + 1] === STAR && view[index + 2] === STAR) {
			start = index;
			break;
		}
	}

	if (start !== -1) {
		for (let index = start + 3; index < view.length - 1; index++) {
			if (view[index] === STAR && view[index + 1] === SLASH) {
				end = index + 2;
				break;
			}
		}
	}

	if (start !== -1 && end !== -1) {
		return new TextDecoder().decode(view.subarray(start, end));
	}

	return '';
}

type Properties = {
	name?: string;
	description?: string;
	source?: string;
	slug?: string;
	alias?: string[];
};

/**
 * Lazily load the comment parser, it might not be needed on every load.
 */
let commentParser: typeof Parser;
async function parseComments(content: string) {
	if (!commentParser) {
		const parser = await import('comment-parser');
		commentParser = parser.parse;
	}

	return commentParser(content);
}

async function parseFile(file: string): Promise<Properties> {
	const contents = await readFirstComment(file);
	return parseContents(contents);
}

async function parseContents(contents: string) {
	const data = await parseComments(contents);

	if (data.length === 0) {
		return {};
	}

	const result = data[0];

	const properties: Properties = {};
	if (result.description) {
		properties.description = result.description;
	}

	for (const tag of data[0].tags) {
		switch (tag.tag) {
			case 'name':
				properties.name = tag.name;
				break;
			case 'source':
				properties.source = tag.name;
				break;
			case 'slug':
				properties.slug = tag.name;
				break;
			case 'alias':
				if (tag.name) {
					if (properties.alias) {
						properties.alias.push(tag.name);
					} else {
						properties.alias = [tag.name];
					}
				}

				break;

			default:
				break;
		}
	}

	return properties;
}


export default {
	file: parseFile,
	contents: parseContents,
};
