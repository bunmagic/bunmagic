export function slugify(text: string) {
	return text.toLowerCase()
		.replaceAll(/\s+/g, '-') // Replace spaces with -
		.replaceAll(/[^\w-]+/g, '') // Remove all non-word chars
		.replaceAll(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

export async function openEditor(path: string) {
	const edit = Bun.env.EDITOR || 'code';

	// If using VSCode, open in a new window
	const result = await (edit === 'code' ? $`code -n ${path}` : $`${edit} ${path} > /dev/tty`);

	if (result.exitCode === 0) {
		return true;
	}

	console.log(result);
	console.log('');
	console.log(ansis.bold('Editor missing!'));
	console.log(`I tried to use "${ansis.bold(edit)}" to open ${path}`);
	console.log(
		`\n 🔗 ${ansis.bold('Read more here: ')}\nhttps://github.com/bunmagic/bunmagic/tree/main#code-editor\n`,
	);
	throw new Error(result.stdout.toString() || result.stderr.toString());
}
