import { parse } from 'comment-parser';

const decoder = new TextDecoder();

export function readFirstComment(view: Uint8Array) {
	const STAR = 42;
	const SLASH = 47;
	let start = -1;
	let end = -1;

	for (let index = 0; index < view.length - 2; index++) {
		// If the comment start hasn't been found in the first 128 bytes, stop looking.
		if (index > 126) {
			return '';
		}

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
		return decoder.decode(view.subarray(start, end));
	}

	return '';
}

type Properties = {
	name?: string;
	description?: string;
	usage?: string;
	source?: string;
	slug?: string;
	alias?: string[];
};

async function parseFile(filePath: string): Promise<Properties | undefined> {
	const file = Bun.file(filePath);
	const buffer = await file.arrayBuffer();
	const view = new Uint8Array(buffer);
	const contents = readFirstComment(view);
	return parseContent(contents);
}

async function parseContent(contents: string) {
	if (contents.length === 0) {
		return;
	}

	const data = parse(contents);
	if (data.length === 0) {
		return;
	}

	const result = data[0];

	const properties: Properties = {};
	if (result.description) {
		properties.description = result.description;
	}

	if (!result.tags) {
		return properties;
	}

	for (const tag of result.tags) {
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
			case 'usage':
				if (tag.name) {
					properties.usage = tag.name;
				}

				if (tag.description) {
					properties.usage += ` ${tag.description}`;
				}

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


export const parseHeader = {
	fromFile: parseFile,
	fromContent: parseContent,
};
