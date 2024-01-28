import {
	getSourceDirectories,
	scriptInfo,
	getScripts,
} from "../sources";

export const desc = `List all known scripts.`;
export const usage = `bunshell list ${chalk.gray(`| bunshell ls`)}`;
export const alias = ["ls"];

export default async function () {
	const sources = await getSourceDirectories();

	const sourceDirs = Array.from(sources).filter(dir => !dir.bin);
	const sourceBins = Array.from(sources).filter(dir => dir.bin);

	let output = chalk.underline.bold("Groups");
	for (const source of sourceBins) {
		output += `\n`;
		output += chalk.bold.white(source.bin);
		output += " → ";
		output += chalk.gray(path.dirname(source.path) + "/");
		output += chalk.bold.gray(path.basename(source.path));
		output += chalk.gray(" (linked)");
	}


	output += `\n\n`;
	output += chalk.underline.bold("Scripts");
	for (const source of sourceDirs) {
		const scripts = await getScripts(source);
		output += `\n `;
		output += chalk.gray(path.dirname(source.path) + "/");
		output += chalk.bold.gray(path.basename(source.path));

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

		const list = scriptList.map(({ slug, bin, file }) => {
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

		output += list.join("");
		output += `\n `;
	}

	console.log(output);
}