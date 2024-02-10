import {
	findNamespace,
	findScript,

} from "../lib/sources";
import { create } from './create';

export const desc = `Edit scripts. If no script name is specified, will open all scripts and the ~/.bunism directory`;
export const usage = `bunism edit [script-name]`;


export default async function () {
	const slug = argv._.join(" ");
	if (!slug) {
		throw new Error('You must specify a script to edit.');
	}
	return await edit(slug);
}

export async function edit(slug: string) {
	const target = await getEditTarget(slug);
	console.log(target);
	if (target) {
		return await openEditor(target);
	}

	return create(slug);
}

export async function openEditor(path: string) {
	const edit = Bun.env.EDITOR || `code`;

	// If using VSCode, open in a new window
	let res;
	if (edit === "code") {
		res = await $`code -n ${path}`;
	} else {
		res = await $`${edit} ${path} > /dev/tty`;
	}

	if (res.exitCode == 0) {
		return true;
	}
	console.log(res);
	console.log("");
	console.log(ansis.bold("Editor missing!"));
	console.log(`I tried to use "${ansis.bold(edit)}" to open ${path}`);
	console.log(
		`\n 🔗 ${ansis.bold("Read more here: ")}\nhttps://github.com/pyronaur/bunism/tree/main#code-editor\n`,
	);
	throw new Error(res.stdout.toString() || res.stderr.toString());
}

async function getEditTarget(input: string) {
	const script = await findScript(input);
	if (script && script.source && (await Bun.file(script.source).exists())) {
		return script.source;
	}
	const namespace = await findNamespace(input);
	if (namespace) {
		return namespace.dir;
	}

	return false;
}