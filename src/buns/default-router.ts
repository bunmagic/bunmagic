import type { Command } from './commands';


export async function run(command?: Command) {
	if (!command) {
		console.log("No command found.");
		return;
	}
	console.log("Hello World");
	console.log("Running command: ", command.name);
	console.log("Command description: ", command.desc);
}