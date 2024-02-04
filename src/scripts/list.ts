import {
	getSources
} from "../lib/sources";

export const desc = `List all known scripts.`;
export const usage = `bunshell list ${ansis.gray(`| bunshell ls`)}`;
export const alias = ["ls"];

export default async function () {
	const sources = await getSources();
	const separator = ansis.dim.gray("╌".repeat(64));
	for (const source of sources) {

		let maxScriptNameLength = 0;
		const inNamespaced = Boolean(source.namespace);
		const basename = path.basename(source.path);
		const name = basename.charAt(0).toUpperCase() + basename.slice(1);


		console.log();
		console.log(separator);
		console.log("  " + ansis.bold(name));
		console.log("  " + ansis.dim(source.path));
		console.log(separator);

		for (const { slug, bin } of source.scripts) {
			if (slug.startsWith("_")) {
				continue;
			}
			const binExists = Bun.which(bin) !== null;
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