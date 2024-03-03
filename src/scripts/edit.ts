import {
	findNamespace,
	findScript,
} from '@lib/sources';
import { openEditor } from '@lib/utils';
import { PATHS } from '@lib/config';
import { create } from './create';

export const desc = 'Edit scripts. If no script name is specified, will open all scripts and the ~/.bunmagic directory';
export const usage = '[script-name]';

export default async function () {
	const slug = argv._.join(' ');
	if (!slug) {
		if (ack(`Slug not specified. Open ${ansis.bold('~/.bunmagic')} ?`)) {
			return openEditor(PATHS.bunmagic);
		}

		return;
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
