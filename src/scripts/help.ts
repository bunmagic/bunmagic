/**
 * Get the full list of available commands.
 */
import { displayScripts } from '@lib/router';
import type { Script } from '@lib/script';

export default async function (scripts: Map<string, Script>) {
	console.log(`\n  ${ansis.bold.yellow('Bunmagic')}\n  ${ansis.dim('Poof! Your buns are now magical.')}`);
	console.log(`\n  ${ansis.bold('Usage:')} ${ansis.bold.yellowBright('bunmagic')} ${ansis.dim('<command>')} ${ansis.dim('[arguments]')}`);
	displayScripts(scripts);
}
