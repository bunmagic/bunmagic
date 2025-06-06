import { slugify } from '@lib/utils';

export type InputMeta = {
	namespace?: string;
	slug: string;
	command: string;
	extension?: string;
};

function parseSlug(input: string): [string, string | undefined] {
	const parts = input
		.split('.')
		.map(part => slugify(part))
		.filter(Boolean);

	if (parts.length === 0) {
		throw new Error(`Invalid input: ${input}`);
	}

	if (parts.length === 1) {
		return [parts[0], undefined];
	}

	if (parts.length === 2) {
		return [parts[0], parts[1]];
	}

	const extension = parts.pop();
	const slug = parts.join('.');
	return [slug, extension];
}

export function parseInput(input: string): InputMeta {
	const array = input.trim().split(' ').filter(Boolean).join('/').split('/').filter(Boolean);
	if (array.length === 1) {
		const [slug, extension] = parseSlug(array[0]);
		return { slug, extension, command: slug };
	}

	if (array.length === 2) {
		const [slug, extension] = parseSlug(array[1]);
		return {
			slug,
			namespace: array[0],
			command: `${array[0]} ${slug}`,
			extension,
		};
	}

	throw new Error('A command should consist of 1 or 2 words.');
}
