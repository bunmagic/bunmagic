import { create } from '../scripts/create';
import help from '../scripts/help';
import type { RouterCallback } from './commands';


const router: RouterCallback = async (namespace, name, script, command, commands) => {
	const input = `${namespace} ${name}`;

	// Offer to create utility if it doesn't exist.
	if (name && !command) {
		try {
			await create(input);
		} catch (e) {
			die(e);
		}
		return;
	}

	if (argv.h || name === "help" || !command) {
		if (name && name !== "help") {
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
			die(e);
		}
	}
}

export default router;