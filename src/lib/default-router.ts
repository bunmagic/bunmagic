import type { RouterCallback } from './commands';


const router: RouterCallback = async (script, command) => {
	if (!command) {
		console.log("No command found.");
		return;
	} else {
		try {
			await script();
		} catch (e) {
			console.log("Error running command: ", 'name' in command ? command.name : command.file);
		}
	}
}

export default router;