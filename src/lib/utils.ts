import { $, chalk } from 'bunmagic';

export function slugify(text: string) {
	return text
		.toLowerCase()
		.replaceAll(/\s+/g, '-') // Replace spaces with -
		.replaceAll(/[^\w-]+/g, '') // Remove all non-word chars
		.replaceAll(/--+/g, '-') // Replace multiple - with single -
		.trim()
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

export async function openEditor(path: string) {
	const edit = Bun.env.EDITOR || 'code';

	// If using VSCode, open in a new window
	let result: Awaited<ReturnType<typeof $>>;
	if (edit === 'code' || edit === 'cursor') {
		result = await $`code -n ${path}`.quiet();
	} else {
		result = await $`${edit} ${path} > /dev/tty`;
	}

	if (result.exitCode === 0) {
		return true;
	}

	console.log(result);
	console.log('');
	console.log(chalk.bold('Editor missing!'));
	console.log(`I tried to use "${chalk.bold(edit)}" to open ${path}`);
	console.log(
		`\n 🔗 ${chalk.bold('Read more here: ')}\nhttps://github.com/bunmagic/bunmagic/tree/main#code-editor\n`,
	);
	throw new Error(result.stdout.toString() || result.stderr.toString());
}
