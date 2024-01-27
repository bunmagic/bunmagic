export async function selection(options: string[], selectionQuestion: string) {
	options.forEach((opt, index) => {
		console.log(`> ${chalk.bold(index + 1)}:  ${opt} `)
	})

	const result = await prompt(selectionQuestion + "(default: 1): \n");
	const selected = result ? parseInt(result) : 1;
	return options[selected - 1];
}

export function cd(path: string) {
	if (path.startsWith("~")) {
		path = os.homedir() + path.slice(1);
	}
	$.cwd(path);
}