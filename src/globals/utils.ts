export function selection(options: string[], selectionQuestion: string) {
	options.forEach((opt, index) => {
		console.log(`> ${ansis.bold(`${index + 1}`)}:  ${opt} `)
	})

	const result = prompt(selectionQuestion + "(default: 1): \n");
	const selected = result ? parseInt(result) : 1;
	return options[selected - 1];
}

export function cd(path: string) {
	if (path.startsWith("~")) {
		path = os.homedir() + path.slice(1);
	}
	$.cwd(path);
}

export function ack(q: string, defaultAnswer: "y" | "n" = "y") {
	let yes_no = `[y/N]`;
	if (defaultAnswer === "y") {
		yes_no = `[Y/n]`;
	}

	let answer = prompt(`${q} ${yes_no} `);

	if (!answer) {
		answer = defaultAnswer;
	}

	return "y" === answer;
}