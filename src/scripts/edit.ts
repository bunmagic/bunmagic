import {
	findNamespace,
	findScript,
} from '../lib/sources';
import {openEditor} from '../lib/utils';
import {create} from './create';

export const desc = 'Edit scripts. If no script name is specified, will open all scripts and the ~/.bunism directory';
export const usage = 'bunism edit [script-name]';

export default async function () {
	const slug = argv._.join(' ');
	if (!slug) {
		throw new Error('You must specify a script to edit.');
	}

	return edit(slug);
}

export async function edit(slug: string) {
	const target = await getEditTarget(slug);
	console.log(target);
	if (target) {
		return openEditor(target);
	}

	return create(slug);
}

async function getEditTarget(input: string) {
	const script = await findScript(input);
	if (script?.source && (await Bun.file(script.source).exists())) {
		return script.source;
	}

	const namespace = await findNamespace(input);
	if (namespace) {
		return namespace.dir;
	}

	return false;
}
