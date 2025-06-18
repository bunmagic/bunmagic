import type { Script } from './script';

/**
 * Display help information for a script
 */
export function displayScriptHelp(script: Script): void {
	// Display script name and description
	console.log(`\n  ${ansis.bold(script.command)}`);
	if (script.desc) {
		console.log(`  ${script.desc}`);
	}

	// Display usage
	if (script.usage?.name) {
		console.log(`\n  ${ansis.bold('Usage:')}`);
		console.log(`    ${script.usage.name}${script.usage.description ? ` ${script.usage.description}` : ''}`);
	}

	// Display flags
	if (script.meta?.flags && script.meta.flags.length > 0) {
		console.log(`\n  ${ansis.bold('Flags:')}`);
		for (const flag of script.meta.flags) {
			console.log(`    ${ansis.cyan(flag.name)}${flag.description ? ` - ${flag.description}` : ''}`);
		}
	}

	// Display other metadata sections
	for (const [section, items] of Object.entries(script.meta || {})) {
		if (section === 'flags') continue; // Already displayed above
		
		console.log(`\n  ${ansis.bold(section.charAt(0).toUpperCase() + section.slice(1))}:`);
		for (const item of items) {
			console.log(`    ${ansis.cyan(item.name)}${item.description ? ` - ${item.description}` : ''}`);
		}
	}

	// Display aliases
	if (script.alias.length > 0) {
		console.log(`\n  ${ansis.bold('Aliases:')} ${script.alias.join(', ')}`);
	}

	console.log(); // Empty line at the end
}