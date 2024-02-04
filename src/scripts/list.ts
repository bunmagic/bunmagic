import {
	getSources
} from "../lib/sources";

export const desc = `List all known scripts.`;
export const usage = `bunshell list ${ansis.gray(`| bunshell ls`)}`;
export const alias = ["ls"];

export default async function () {
	const sources = await getSources();

	for (const source of sources) {

		const inNamespaced = 'namespace' in source;
		console.log(ansis.gray(path.dirname(source.path) + "/"));
		console.log(ansis.bold.gray(path.basename(source.path)));

		let maxScriptNameLength = 0;

		for (const { slug, bin } of source.scripts) {
			const binExists = await Bun.file(bin).exists();
			const symbol = binExists || inNamespaced
				? ansis.bold.green("·")
				: ansis.bold.red("x");
			const scriptNameWithSymbolLength = `${symbol} ${slug}`.length;
			if (scriptNameWithSymbolLength > maxScriptNameLength) {
				maxScriptNameLength = scriptNameWithSymbolLength;
			}

			let scriptNameWithSymbol = `${symbol} ${slug}`;
			if ('namespace' in source) {
				const namespace = source.namespace ? ` ${source.namespace}` : '';
				scriptNameWithSymbol = `${symbol}${namespace} ${slug}`;
			}
			let scriptOutput = scriptNameWithSymbol;
			let line = `${scriptOutput}`;
			if (!binExists && !inNamespaced) {
				line += `\n   ${ansis.red("▲ script executable missing")}`;
			}

			console.log(line);
		}
	}

}