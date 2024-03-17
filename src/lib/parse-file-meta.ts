
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



async function parseFile(filePath: string): Promise<Properties | undefined> {
	const file = Bun.file(filePath);
	const buffer = await file.arrayBuffer();
	const view = new Uint8Array(buffer);
	const contents = readFirstComment(view);
	return parseContent(contents);
}

type Meta = { name: string; description: string };
type Properties = {
	name: string;
	description: string;
	meta: {
		usage: Meta[];
		flags: Meta[];
		subcommands: Meta[];
	};
	source: string;
	slug: string;
	alias: string[];
};
async function parseContent(contents: string) {
	if (contents.length === 0) {
		return;
	}

	const data = parse(contents, {
		spacing: 'preserve',
	});
	if (data.length === 0) {
		return;
	}

	const result = data[0];

	const properties: Properties = {
		name: '',
		description: '',
		meta: {
			usage: [],
			flags: [],
			subcommands: [],
		},
		source: '',
		slug: '',
		alias: [],
	};
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
				properties.meta.usage.push({ name: tag.name, description: tag.description });

				break;
			case 'alias':
				if (tag.name) {
					properties.alias.push(tag.name);
				}

				break;
			case 'flag':
				properties.meta.flags.push({ name: tag.name, description: tag.description });
				break;
			case 'cmd':
			case 'command':
			case 'subcommand':
				if (tag.name) {
					properties.meta.subcommands.push({ name: tag.name, description: tag.description });
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
