
export const name = "version";
export const desc = "Display the current version of bunshell";

export default async function version() {
	const pkg = require("../../package.json");
	console.log(pkg.version);
}