import help from '../scripts/help';
import type { RouterCallback } from './commands';


const router: RouterCallback = async (script, command, commands) => {
	const input = argv._.join(" ");

	if (argv.h || input === "help" || !command) {
		if (input && input !== "help") {
			console.log(ansis.yellow(`> Command not found: ${ansis.bold(input)}\n`));
		}
		await help(commands);
		return;
	}

	if (!command) {
		console.log("No command found.");
		return;
	} else {

		try {
			await script();
		} catch (e) {
			console.log(e);
			console.log("Error running command: ", (command && 'name' in command) ? command.name : command.file);
		}
	}
}

export default router;