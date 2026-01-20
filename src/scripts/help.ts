/**
 * Get help for bunmagic commands.
 * @autohelp
 * @usage [[command]]
 * @example help
 * @example help exec
 * @example exec --help
 */
import { displayScriptHelp } from '@lib/help-display';
import { displayScripts } from '@lib/router';
import type { Script } from '@lib/script';
import { slugify } from '@lib/utils';

export default async function (scripts: Map<string, Script>, commandName?: string) {
	const command = commandName ? slugify(commandName) : '';

	if (command) {
		const match = scripts.get(command);
		if (match) {
			displayScriptHelp(match, match.namespace);
			return;
		}

		console.log(ansis.yellow(`\n> Unknown command: ${ansis.bold(commandName)}\n`));
	}

	console.log(
		`\n  ${ansis.bold.yellow('Bunmagic')}\n  ${ansis.dim('Poof! Your buns are now magical.')}`,
	);
	console.log(
		`\n  ${ansis.bold('Usage:')} ${ansis.bold.yellowBright('bunmagic')} ${ansis.dim('<command>')} ${ansis.dim('[arguments]')}`,
	);
	displayScripts(scripts);
}
