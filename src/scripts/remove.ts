/**
 * Remove and unlink a script
 * @autohelp
 * @usage <script-name>
 * @alias rm
 */
import { PATHS, update } from '@lib/config';
import { Script } from '@lib/script';
import { findAny, findNamespace, getSources, type Source } from '@lib/sources';

async function binTargetsScript(binPath: string, scriptSource: string) {
	try {
		const content = await Bun.file(binPath).text();
		return content.includes(scriptSource);
	} catch {
		return false;
	}
}

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

	for (const alias of new Set([...script.alias, ...script.globalAliases])) {
		const aliasBin = `${PATHS.bins}/${alias}`;
		const aliasFileExists = await Bun.file(aliasBin).exists();
		const aliasMatches = aliasFileExists && (await binTargetsScript(aliasBin, script.source));
		if (aliasMatches && ack(`Remove alias binary "${ansis.bold(alias)}"?`)) {
			await $`rm ${aliasBin}`;
		}
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
		throw new Error('You must specify which script to remove.');
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
