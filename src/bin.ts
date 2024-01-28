import "./index";
const commandFile = argv._.shift();
if (!commandFile) {
	throw new Error(`No command file specified.`);
}
await import(commandFile);
