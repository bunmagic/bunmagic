import "./index";

const scriptFile = argv._.shift();

if (!scriptFile) {
	throw new Error(`No script specified.`);
}

const script = await import(scriptFile);
if (script.default) {
	await script.default();
}
