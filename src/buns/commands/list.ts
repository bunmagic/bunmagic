import {
	getSources
} from "../sources";

export const desc = `List all known scripts.`;
export const usage = `bunshell list ${chalk.gray(`| bunshell ls`)}`;
export const alias = ["ls"];

export default async function () {
	const sources = await getSources();

	for (const source of sources) {

		const inNamespaced = 'namespace' in source;
		console.log(chalk.gray(path.dirname(source.path) + "/"));
		console.log(chalk.bold.gray(path.basename(source.path)));

		let maxScriptNameLength = 0;

		for (const { slug, bin } of source.scripts) {
			const binExists = await Bun.file(bin).exists();
			const symbol = binExists || inNamespaced
				? chalk.bold.green("·")
				: chalk.bold.red("x");
			const scriptNameWithSymbolLength = `${symbol} ${slug}`.length;
			if (scriptNameWithSymbolLength > maxScriptNameLength) {
				maxScriptNameLength = scriptNameWithSymbolLength;
			}

			let scriptNameWithSymbol = `${symbol} ${slug}`;
			if ('namespace' in source) {
				scriptNameWithSymbol = `${symbol} ${source.namespace} ${slug}`;
			}
			let scriptOutput = scriptNameWithSymbol;
			let line = `\n ${scriptOutput}`;
			if (!binExists && !inNamespaced) {
				line += `\n   ${chalk.red("▲ script executable missing")}`;
			}

			console.log(line);
		}
	}

}