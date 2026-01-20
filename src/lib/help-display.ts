import type { Script } from './script';

type UsageStyle = 'plain' | 'required' | 'optional';

function applyUsageStyle(text: string, style: UsageStyle): string {
	if (style === 'required') {
		return ansis.yellow(text);
	}
	if (style === 'optional') {
		return ansis.dim(ansis.yellow(text));
	}
	return text;
}

function readAnsiSequence(input: string, start: number): number {
	if (input[start] !== '\x1b') return 0;
	const next = input[start + 1];
	if (next === '[') {
		for (let i = start + 2; i < input.length; i += 1) {
			const code = input.charCodeAt(i);
			if (code >= 0x40 && code <= 0x7e) {
				return i - start + 1;
			}
		}
		return input.length - start;
	}
	if (next === ']') {
		for (let i = start + 2; i < input.length; i += 1) {
			const ch = input[i];
			if (ch === '\x07') {
				return i - start + 1;
			}
			if (ch === '\x1b' && input[i + 1] === '\\') {
				return i - start + 2;
			}
		}
		return input.length - start;
	}
	return start + 1 < input.length ? 2 : 1;
}

function hasClosing(input: string, start: number, closeChar: string): boolean {
	for (let i = start; i < input.length; i += 1) {
		if (input[i] === '\x1b') {
			const length = readAnsiSequence(input, i);
			i += Math.max(length - 1, 0);
			continue;
		}
		if (input[i] === closeChar) return true;
	}
	return false;
}

function formatUsageLine(input: string): string {
	let requiredDepth = 0;
	let optionalDepth = 0;
	let buffer = '';
	let bufferStyle: UsageStyle = 'plain';
	const parts: string[] = [];

	const flush = () => {
		if (!buffer) return;
		parts.push(applyUsageStyle(buffer, bufferStyle));
		buffer = '';
	};

	const append = (ch: string, style: UsageStyle) => {
		if (style !== bufferStyle) {
			flush();
			bufferStyle = style;
		}
		buffer += ch;
	};

	for (let i = 0; i < input.length; i += 1) {
		const ch = input[i];
		if (ch === '\x1b') {
			const length = readAnsiSequence(input, i);
			flush();
			parts.push(input.slice(i, i + length));
			i += Math.max(length - 1, 0);
			continue;
		}

		if (ch === '<' && hasClosing(input, i + 1, '>')) {
			const style: UsageStyle = optionalDepth > 0 ? 'optional' : 'required';
			append(ch, style);
			requiredDepth += 1;
			continue;
		}

		if (ch === '>' && requiredDepth > 0) {
			const style: UsageStyle = optionalDepth > 0 ? 'optional' : 'required';
			append(ch, style);
			requiredDepth -= 1;
			continue;
		}

		if (ch === '[' && hasClosing(input, i + 1, ']')) {
			const style: UsageStyle = 'optional';
			append(ch, style);
			optionalDepth += 1;
			continue;
		}

		if (ch === ']' && optionalDepth > 0) {
			const style: UsageStyle = 'optional';
			append(ch, style);
			optionalDepth -= 1;
			continue;
		}

		const style: UsageStyle =
			optionalDepth > 0 ? 'optional' : requiredDepth > 0 ? 'required' : 'plain';
		append(ch, style);
	}

	flush();
	return parts.join('');
}

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

	usageLine = formatUsageLine(usageLine);
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
					const paramStyled = pf.isOptional
						? ansis.dim(ansis.yellow(paramDisplay))
						: ansis.yellow(paramDisplay);
					paramStr = ` ${paramStyled}`;
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

		const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
		console.log(`\n  ${ansis.bold(`${sectionTitle}:`)}`);

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
