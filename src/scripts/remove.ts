import {
	PATHS, update, type Collection,
} from '@lib/config';
import {
	getSources, findNamespace, findScript,
} from '@lib/sources';

export const desc = 'Remove and unlink a script';
export const usage = 'bunmagic remove <script-name>';
export const alias = ['rm'];

async function removeNamespace(query: string) {
	const source = await findNamespace(query);
	if (!source) {
		throw new Error(`Namespace "${query}" not found`);
	}

	if (!ack(`Unlink namespace "${ansis.bold(query)}"?`)) {
		return false;
	}

	const sources = await getSources();
	const updatedSources = sources.filter((d): d is Collection => 'namespace' in d && d.namespace !== source.namespace);
	// @TODO: The type doesn't complain, but the type is incorrect. I'm updating both scripts and namespaces.
	await update('sources', updatedSources);
}

export default async function () {
	if (argv._.length === 0) {
		throw new Error(
			`You must specify which script to remove.\n${usage}`,
		);
	}

	const input = argv._.join(' ');
	const script = await findScript(input);

	if (!script) {
		try {
			await removeNamespace(input);
		} catch {
			console.log(`Can't find a namespace or a script with the name "${input}".`);
		}

		return;
	}

	if (!ack(`Delete command "${ansis.bold(input)}"?`)) {
		return false;
	}

	const binaryFile = path.join(PATHS.bins, script.source);
	const binaryFileExists = await Bun.file(script.bin).exists();
	const sourceFileExists = await Bun.file(script.source).exists();

	if (binaryFileExists) {
		await $`rm ${binaryFile}`;
		return;
	}

	if (sourceFileExists && ack('Remove the source file?')) {
		await $`rm ${script.source}`;
	}

	if (!binaryFileExists && !sourceFileExists) {
		console.log(`🍀 You're in luck! "${input}" doesn't exist already!`);
	}
}

