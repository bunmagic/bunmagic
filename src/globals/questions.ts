import { createInterface } from 'node:readline'

export async function question(
	query?: string,
	options?: { choices: string[] }
): Promise<string> {
	let completer = undefined
	if (options && Array.isArray(options.choices)) {
		/* c8 ignore next 5 */
		completer = function completer(line: string) {
			const completions = options.choices
			const hits = completions.filter((c) => c.startsWith(line))
			return [hits.length ? hits : completions, line]
		}
	}
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true,
		completer,
	})

	return new Promise((resolve) =>
		rl.question(query ?? '', (answer) => {
			rl.close()
			resolve(answer)
		})
	)
}

export async function confirm(q: string, defaultAnswer: "y" | "n" = "n"): Promise<boolean> {
	let yes_no = `(y/N)`;
	if (defaultAnswer === "y") {
		yes_no = `(Y/n)`;
	}

	let answer = await question(`${q} ${yes_no} `);

	if (!answer) {
		answer = defaultAnswer;
	}

	return "y" === answer;
}

export async function selection(options: string[], selectionQuestion: string) {
	options.forEach((opt, index) => {
		console.log(`> ${chalk.bold(index + 1)}:  ${opt} `)
	})

	const selected = parseInt(await question(selectionQuestion + "(default: 1): \n")) ?? 1;
	return options[selected - 1];
}