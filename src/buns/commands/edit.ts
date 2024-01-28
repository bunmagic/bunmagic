import {
	search,
	getSourceDirectories,
} from "../sources";
import { PATHS } from "../config";
import { create } from './create';

export const desc = `Edit scripts. If no script name is specified, will open all scripts and the ~/.bunshell directory`;
export const usage = `bunshell edit [script-name]`;


export default async function () {
	const slug = argv._[0];
	if (!slug) {
		throw new Error('You must specify a script to edit.');
	}
	const target = await findFile(slug);

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
	console.log(chalk.bold("Editor missing!"));
	console.log(`I tried to use "${chalk.bold(edit)}" to open ${path}`);
	console.log(
		`\n 🔗 ${chalk.bold("Read more here: ")}\nhttps://github.com/pyronaur/bunshell/tree/main#code-editor\n`,
	);
	throw new Error(res.stdout.toString() || res.stderr.toString());
}

export async function findFile(slug: string) {
	if (slug) {
		const script = await search(slug);
		if (script && script.file && (await Bun.file(script.file).exists())) {
			return script.file;
		}
	}

	fs.ensureDir(PATHS.bunshell);
	for (const source of await getSourceDirectories()) {
		if (source?.bin === slug || path.basename(source.path) === slug) {
			return source.path;
		}
	}

	return false;
}