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
	const view = new Uint8Array(await Bun.file(filePath).arrayBuffer());
	const contents = readFirstComment(view);
	return parseContent(contents);
}

type Meta = { name: string; description: string; group?: string };
type Properties = {
	name: string;
	description: string;
	usage: Meta;
	meta: Record<string, Meta[]>;
	source: string;
	slug: string;
	alias: string[];
	globalAliases: string[];
	autohelp: boolean;
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
		usage: { name: '', description: '' },
		source: '',
		slug: '',
		alias: [],
		globalAliases: [],
		meta: {},
		autohelp: false,
	};

	if (result.description) {
		properties.description = result.description;
	}

	if (!result.tags) {
		return properties;
	}

	let currentGroup: string | undefined;

	for (const spec of result.tags) {
		let tag = spec.tag;

		// Handle @group tag
		if (tag === 'group') {
			currentGroup = `${spec.name} ${spec.description}`.trim();
			continue;
		}

		if (tag === 'name' || tag === 'source' || tag === 'slug') {
			properties[tag] = `${spec.name} ${spec.description}`.trim();
			continue;
		}

		if (tag === 'usage') {
			properties.usage = { name: spec.name, description: spec.description };
			continue;
		}

		if (tag === 'alias') {
			properties.alias.push(spec.name);
			continue;
		}

		if (tag === 'global') {
			if (spec.name) {
				properties.globalAliases.push(spec.name);
			}
			continue;
		}

		if (tag === 'autohelp') {
			properties.autohelp = true;
			continue;
		}

		if (tag === 'flag') {
			tag = 'flags';
		}

		properties.meta[tag] ||= [];
		const meta: Meta = { name: spec.name, description: spec.description };

		// Add group to flags if we're in a group
		if (tag === 'flags' && currentGroup) {
			meta.group = currentGroup;
		}

		properties.meta[tag].push(meta);
	}

	return properties;
}

export const parseHeader = {
	fromFile: parseFile,
	fromContent: parseContent,
};
