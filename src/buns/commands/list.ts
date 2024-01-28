import {
	getSourceDirectories,
	scriptInfo,
	getScripts,
} from "../sources";

export const desc = `List all known scripts.`;
export const usage = `bunshell list ${chalk.gray(`| bunshell ls`)}`;
export const alias = ["ls"];

export default async function run() {
	const sourceDirs = getSourceDirectories();

	let output = "";
	for (const directory of sourceDirs) {
		const scripts = await getScripts(directory);
		output += `\n `;
		output += chalk.gray(path.dirname(directory) + "/");
		output += chalk.bold.gray(path.basename(directory));

		let scriptList = scripts.map(scriptInfo);
		let maxScriptNameLength = 0;

		scriptList.forEach(({ slug, bin }) => {
			const binExists = fs.pathExistsSync(bin);
			const symbol = binExists
				? chalk.bold.green("·")
				: chalk.bold.red("x");
			const scriptNameWithSymbolLength = `${symbol} ${slug}`.length;
			if (scriptNameWithSymbolLength > maxScriptNameLength) {
				maxScriptNameLength = scriptNameWithSymbolLength;
			}
		});

		const leaderDotSpacing = 2; // Number of spaces between the script names and the leader dots

		scriptList = scriptList.map(({ slug, bin, file }) => {
			const binExists = fs.pathExistsSync(bin);
			const symbol = binExists
				? chalk.bold.green("·")
				: chalk.bold.red("x");
			let scriptNameWithSymbol = `${symbol} ${slug}`;
			let scriptOutput = scriptNameWithSymbol;

			// Add leader dots only if there is a description
			const firstLine = fs.readFileSync(file, "utf-8").split("\n")[1];
			let descriptionText = "";

			if (firstLine.trim().startsWith(`// desc:`)) {
				const text = firstLine.trim().replace(`// desc:`, ``).trim();
				if (text) {
					const spaces = maxScriptNameLength + leaderDotSpacing - scriptNameWithSymbol.length;
					const leaderDots = chalk.gray.dim("┈".repeat(spaces));
					descriptionText = ` ${leaderDots} ${chalk.gray(text)}`;
				}
			}


			let line = `\n ${scriptOutput}${descriptionText}`;
			if (!binExists) {
				line += `\n   ${chalk.red("▲ script executable missing")}`;
			}

			return line;
		});

		output += scriptList.join("");
		output += `\n `;
	}

	console.log(output);
}