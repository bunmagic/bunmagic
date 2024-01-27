async function confirm(q, defaultAnswer = "n") {
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

async function selection(options, selectionQuestion) {
	let result;
	options.forEach((opt, index) => {
		console.log(`> ${chalk.bold(index + 1)}:  ${opt} `)
	})

	const selected = await question(selectionQuestion + "(default: 1): \n") ?? 1;
	result = options[selected - 1];

	return result;
}



export { confirm, selection };
