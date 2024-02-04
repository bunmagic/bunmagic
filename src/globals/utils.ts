import { default as os } from 'node:os';

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

	return "y" === answer.toLowerCase();
}


export function die(error?: unknown) {
	if (error === 0) {
		process.exit(0);
	}
	if (!error) {
		console.warn("Exiting without error.")
		process.exit(1);
	}
	const message = error instanceof Error ? error.message : error.toString();
	console.log(`\n${ansis.red.bold("(!)")} ${message}`)
	process.exit(1);
}