import {
	search,
	getSourceDirectories,
} from "../sources";
import { PATHS } from "../config";

export const info = {
	desc: `Edit scripts. If no script name is specified, will open all scripts and the ~/.bunshell directory`,
	usage: `bunshell edit [script-name]`,
};

export async function run() {
	const path = argv._[0];
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


async function edit(slug: string) {
	if (slug) {
		const { file } = await search(slug);
		if (file && (await fs.pathExists(file))) {
			return await editor(file);
		}
	}

	fs.ensureDir(PATHS.sources);

	for (const source of getSourceDirectories()) {
		const dirname = path.basename(source);
		const symlink = `${PATHS.sources}/${dirname}`;
		if (
			!fs.pathExistsSync(symlink) &&
			fs.pathExistsSync(source) &&
			fs.isDirectorySync(source)
		) {
			await $`ln -s ${source} ${symlink}`;
		}
	}
	await editor(PATHS.bunshell);
}