import type { Script } from './script';

/**
 * Display help information for a script
 */
export function displayScriptHelp(script: Script, namespace?: string): void {
	// Display script name and description
	console.log(`\n  ${ansis.bold(script.command)}`);
	if (script.desc) {
		for (const line of script.desc.trim().split('\n')) {
			if (line.trim().length === 0) {
				console.log('');
				continue;
			}
			console.log(`  ${line.trimEnd()}`);
		}
	}

	// Display usage
	console.log(`\n  ${ansis.bold('Usage:')}`);
	const fullCommand =
		namespace?.trim() && !script.command.startsWith(`${namespace} `)
			? `${namespace} ${script.command}`
			: script.command;
	const rawUsage =
		script.usage && (script.usage.name || script.usage.description)
			? namespace?.trim() && script.usage.name === namespace
				? (script.usage.description ?? '').trim()
				: [script.usage.name, script.usage.description].filter(Boolean).join(' ').trim()
			: '';

	let usageLine = fullCommand;
	if (rawUsage) {
		if (rawUsage === script.slug || rawUsage.startsWith(`${script.slug} `)) {
			usageLine = `${fullCommand}${rawUsage.slice(script.slug.length)}`;
		} else if (rawUsage.startsWith(`${fullCommand} `) || rawUsage === fullCommand) {
			usageLine = rawUsage;
		} else {
			usageLine = `${fullCommand} ${rawUsage}`;
		}
	}

	// Highlight required parameters in yellow
	usageLine = usageLine.replace(/<([^>]+)>/g, (_match, param) => ansis.yellow(`<${param}>`));
	// Highlight optional parameters in dim yellow
	usageLine = usageLine.replace(/\[([^\]]+)\]/g, (_match, param) =>
		ansis.dim(ansis.yellow(`[${param}]`)),
	);
	console.log(`    ${usageLine}`);

	// Display flags
	if (script.meta?.flags && script.meta.flags.length > 0) {
		// Parse flags to separate flag names from parameters
		const parsedFlags = script.meta.flags.map(flag => {
			// Match pattern like "--flag, -f <param>" or "--flag <param>" or just "--flag"
			const match = flag.name.match(/^((?:--?[\w-]+(?:,\s*)?)+)\s*(.*)$/);
			if (match) {
				let param = match[2];
				let isOptional = false;

				// Check if parameter is wrapped in brackets [param] indicating optional
				if (param.startsWith('[') && param.endsWith(']')) {
					isOptional = true;
					param = param.slice(1, -1);
				}

				return {
					flags: match[1],
					param,
					isOptional,
					description: flag.description,
					group: flag.group,
				};
			}
			return {
				flags: flag.name,
				param: '',
				isOptional: false,
				description: flag.description,
				group: flag.group,
			};
		});

		// Group flags by their group property
		const groupedFlags = new Map<string | undefined, typeof parsedFlags>();
		for (const flag of parsedFlags) {
			const group = flag.group;
			if (!groupedFlags.has(group)) {
				groupedFlags.set(group, []);
			}
			const groupFlags = groupedFlags.get(group);
			if (groupFlags) {
				groupFlags.push(flag);
			}
		}

		// Calculate the maximum width for flag + param combination across all groups
		const maxFlagParamWidth = Math.max(
			...parsedFlags.map(pf => {
				// For flags with aliases like "--verbose, -v", align them properly
				const flagParts = pf.flags.split(',').map(f => f.trim());
				const longestFlag = Math.max(...flagParts.map(f => f.length));
				const paramLength = pf.param ? (pf.isOptional ? pf.param.length + 2 : pf.param.length) : 0;
				return longestFlag + (paramLength ? paramLength + 1 : 0);
			}),
		);

		// Display flags by group
		const groups = Array.from(groupedFlags.entries());

		// Sort groups: undefined group first, then alphabetically
		groups.sort(([a], [b]) => {
			if (a === undefined) return -1;
			if (b === undefined) return 1;
			return a.localeCompare(b);
		});

		for (const [group, flags] of groups) {
			if (group) {
				console.log(`\n  ${ansis.bold(`${group}:`)}`);
			} else if (groups.length > 1) {
				console.log(`\n  ${ansis.bold('Flags:')}`);
			} else {
				console.log(`\n  ${ansis.bold('Flags:')}`);
			}

			for (const pf of flags) {
				const flagParts = pf.flags.split(',').map(f => f.trim());
				const longestFlagLength = Math.max(...flagParts.map(f => f.length));

				// Format flags with proper spacing between aliases
				const formattedFlags = flagParts
					.map((flag, idx) => {
						const padding =
							idx < flagParts.length - 1 ? ' '.repeat(longestFlagLength - flag.length) : '';
						return ansis.cyan(flag) + padding;
					})
					.join(', ');

				// Format parameter with optional brackets if needed
				let paramStr = '';
				if (pf.param) {
					const paramDisplay = pf.isOptional ? `[${pf.param}]` : pf.param;
					paramStr = ` ${ansis.yellow(paramDisplay)}`;
				}

				const paramLength = pf.param ? (pf.isOptional ? pf.param.length + 2 : pf.param.length) : 0;
				const totalLength = longestFlagLength + (paramLength ? paramLength + 1 : 0);
				const padding = ' '.repeat(maxFlagParamWidth - totalLength);
				console.log(`    ${formattedFlags}${paramStr}${padding}  ${pf.description || ''}`);
			}
		}
	}

	// Display other metadata sections
	for (const [section, items] of Object.entries(script.meta || {})) {
		if (section === 'flags') continue; // Already displayed above

		console.log(`\n  ${ansis.bold(section.charAt(0).toUpperCase() + section.slice(1))}:`);

		// For examples section, strip namespace prefix to avoid redundancy
		if (section === 'example' && namespace?.trim()) {
			for (const item of items) {
				const displayName = item.name;
				const description = item.description || '';

				// If name is just the namespace and description contains the example
				if (displayName === namespace && description) {
					// The example is in the description, just show it
					console.log(`    ${ansis.cyan(description)}`);
				} else {
					// Regular format
					console.log(`    ${ansis.cyan(displayName)}${description ? `  ${description}` : ''}`);
				}
			}
		} else {
			// Calculate the maximum item width for proper alignment
			const maxItemWidth = Math.max(...items.map(item => ansis.strip(item.name).length));

			for (const item of items) {
				const itemStr = ansis.cyan(item.name);
				const padding = ' '.repeat(maxItemWidth - ansis.strip(item.name).length);
				console.log(`    ${itemStr}${padding}  ${item.description || ''}`);
			}
		}
	}

	// Display aliases
	if (script.alias.length > 0) {
		console.log(`\n  ${ansis.bold('Aliases:')} ${script.alias.join(', ')}`);
	}

	console.log(); // Empty line at the end
}
