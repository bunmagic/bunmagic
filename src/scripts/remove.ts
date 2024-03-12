/**
* Remove and unlink a script
* @usage <script-name>
* @alias rm
*/
import { Script } from '@lib/script';
import { update } from '@lib/config';
import {
	getSources, findNamespace, type Source, findAny,
} from '@lib/sources';

async function removeNamespace(query: string) {
	const source = await findNamespace(query);
	if (!source) {
		throw new Error(`Namespace "${query}" not found`);
	}

	if (!ack(`Unlink namespace "${ansis.bold(query)}"?`)) {
		return false;
	}

	const sources = await getSources();
	const updatedSources = sources
		.filter((d): d is Source => 'namespace' in d && d.namespace !== source.namespace)
		.map(({ namespace, dir }) => ({ namespace, dir }));
	await update('sources', updatedSources);
}

async function removeScript(script: Script) {
	if (!ack(`Delete command "${ansis.bold(script.slug)}"?`)) {
		return false;
	}

	const binaryFileExists = await Bun.file(script.bin).exists();
	const sourceFileExists = await Bun.file(script.source).exists();

	console.log(ansis.gray(`Removing "${script.bin}"`));
	if (binaryFileExists && ack('Remove the binary?')) {
		await $`rm ${script.bin}`;
	}

	console.log(ansis.gray(`Removing "${script.source}"`));
	if (sourceFileExists && ack('Remove the source file?')) {
		await $`rm ${script.source}`;
	}

	if (!binaryFileExists && !sourceFileExists) {
		console.log(`🍀 You're in luck! "${script.slug}" doesn't exist already!`);
	}
}

export default async function () {
	if (args.length === 0) {
		throw new Error(
			`You must specify which script to remove.`,
		);
	}

	const input = args.join(' ');
	const script = await findAny(input);

	if (!script) {
		throw new Exit(`Can't find script or namespace "${input}"`);
	}

	if (script instanceof Script) {
		return removeScript(script);
	}

	if (script.namespace) {
		return removeNamespace(input);
	}

	throw new Exit('Unknown script type');
}

