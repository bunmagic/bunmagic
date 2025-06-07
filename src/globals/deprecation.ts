const DEPRECATION_MESSAGE =
	'bunmagic: Implicit globals are deprecated. Please use explicit imports instead.\n  For quick scripts, add: import "bunmagic/globals";\n  For production code, import only what you need.';
const SHOWN_WARNINGS = new Set<string>();
let EXPLICIT_IMPORT = false;

export function setExplicitImport(value: boolean): void {
	EXPLICIT_IMPORT = value;
}

const IMPORT_SUGGESTIONS = {
	$: "import { $ } from 'bunmagic';",
	ansis: "import { ansis } from 'bunmagic';",
	chalk: "import { chalk } from 'bunmagic';",
	path: "import { path } from 'bunmagic';",
	argv: "import { argv } from 'bunmagic';",
	args: "import { args } from 'bunmagic';",
	flags: "import { flags } from 'bunmagic';",
	select: "import { select } from 'bunmagic';",
	autoselect: "import { autoselect } from 'bunmagic';",
	getPassword: "import { getPassword } from 'bunmagic';",
	$spinner: "import { $spinner } from 'bunmagic';",
	cd: "import { cd } from 'bunmagic';",
	ack: "import { ack } from 'bunmagic';",
	ask: "import { ask } from 'bunmagic';",
	isDirectory: "import { isDirectory } from 'bunmagic';",
	ensureDirectory: "import { ensureDirectory } from 'bunmagic';",
	notMinimist: "import { notMinimist } from 'bunmagic';",
	Exit: "import { Exit } from 'bunmagic';",
	$HOME: "import { $HOME } from 'bunmagic';",
	$get: "import { $get } from 'bunmagic';",
	glob: "import { glob } from 'bunmagic';",
	openEditor: "import { openEditor } from 'bunmagic';",
	slugify: "import { slugify } from 'bunmagic';",
	resolveTilde: "import { resolveTilde } from 'bunmagic';",
	cwd: "import { cwd } from 'bunmagic';",
	SAF: "import { SAF } from 'bunmagic';",
	die: "import { die } from 'bunmagic';",
	copyToClipboard: "import { copyToClipboard } from 'bunmagic';",
	os: "import { os } from 'bunmagic';",
};

function shouldShowWarning(): boolean {
	// If explicitly imported, don't show warnings
	if (EXPLICIT_IMPORT) {
		return false;
	}

	// Check if warnings are disabled via environment variable
	if (process.env.BUNMAGIC_DISABLE_DEPRECATION_WARNINGS === 'true') {
		return false;
	}

	// Check if we're in a test environment
	if (process.env.NODE_ENV === 'test' || process.env.BUNMAGIC_TEST === 'true') {
		return false;
	}

	return true;
}

function showDeprecationWarning(globalName: string): void {
	if (!shouldShowWarning()) {
		return;
	}

	// Only show each warning once per global
	if (SHOWN_WARNINGS.has(globalName)) return;

	SHOWN_WARNINGS.add(globalName);

	const suggestion = IMPORT_SUGGESTIONS[globalName as keyof typeof IMPORT_SUGGESTIONS];
	const message = suggestion ? `${DEPRECATION_MESSAGE}\n  Use: ${suggestion}` : DEPRECATION_MESSAGE;

	// Check if --trace flag is passed
	const hasTraceFlag = process.argv.includes('--trace') || process.argv.includes('-trace');

	if (hasTraceFlag) {
		// Use console.trace to show the call stack
		console.trace(`\x1b[33m${message}\x1b[0m`);
	} else {
		// Use process.stderr.write for immediate output
		process.stderr.write(`\x1b[33m${message}\x1b[0m\n`);
	}
}

export function createDeprecatedProxy<T>(target: T, globalName: string): T {
	// For primitive values or non-object types, we can't create a proxy
	if (typeof target !== 'object' || target === null) {
		// Show warning on first access (we'll handle this differently in globals.ts)
		return target;
	}

	// For functions, we need special handling
	if (typeof target === 'function') {
		const handler = {
			apply(targetFn: any, thisArg: any, argList: any[]): any {
				showDeprecationWarning(globalName);
				return Reflect.apply(targetFn, thisArg, argList);
			},
			get(targetObj: any, prop: string | symbol): any {
				// Handle function properties (like $.cwd)
				if (prop in targetObj) {
					showDeprecationWarning(globalName);
					return Reflect.get(targetObj, prop);
				}
				return undefined;
			},
		};
		return new Proxy(target, handler) as T;
	}

	// For objects, track property access
	const handler = {
		get(targetObj: any, prop: string | symbol): any {
			showDeprecationWarning(globalName);
			return Reflect.get(targetObj, prop);
		},
		set(targetObj: any, prop: string | symbol, value: any): boolean {
			showDeprecationWarning(globalName);
			return Reflect.set(targetObj, prop, value);
		},
	};

	return new Proxy(target, handler) as T;
}

export function deprecatedGetter<T>(globalName: string, value: T): () => T {
	return () => {
		showDeprecationWarning(globalName);
		return value;
	};
}
