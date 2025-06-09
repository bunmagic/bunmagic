import { createDeprecatedProxy, deprecatedGetter, setExplicitImport } from './globals/deprecation';
import * as globals from './index';

// This will be set to true when imported via "bunmagic/globals"
export function markAsExplicitlyImported() {
	setExplicitImport(true);
	// Also set an environment variable so child processes know
	process.env.BUNMAGIC_EXPLICIT_GLOBALS = 'true';
}

// For backwards compatibility, check if we should show warnings
// Check the import URL to determine how this module was loaded
const importPath = import.meta.url;
const isPackageImport =
	importPath.endsWith('/bunmagic/globals') || importPath.includes('bunmagic/globals');

if (isPackageImport) {
	// This is the "import 'bunmagic/globals'" path - no warnings
	markAsExplicitlyImported();
}

// Create proxied versions of globals that show deprecation warnings
const deprecatedGlobals: Record<string, unknown> = {};

// Handle each global with appropriate deprecation wrapper
for (const [key, value] of Object.entries(globals)) {
	if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
		deprecatedGlobals[key] = createDeprecatedProxy(value, key);
	} else {
		// For primitive values, we'll use getter functions
		Object.defineProperty(deprecatedGlobals, key, {
			get: deprecatedGetter(key, value),
			enumerable: true,
			configurable: true,
		});
	}
}

// Assign each global individually to preserve property descriptors
// Use Object.keys to avoid triggering getters during iteration
for (const key of Object.keys(deprecatedGlobals)) {
	// Skip if property already exists on globalThis
	if (Object.prototype.hasOwnProperty.call(globalThis, key)) {
		continue;
	}

	const descriptor = Object.getOwnPropertyDescriptor(deprecatedGlobals, key);
	if (descriptor) {
		Object.defineProperty(globalThis, key, descriptor);
	} else {
		// This shouldn't happen since we create all properties with descriptors
		(globalThis as Record<string, unknown>)[key] = deprecatedGlobals[key];
	}
}

// Add bunmagic namespace without deprecation
if (!Object.prototype.hasOwnProperty.call(globalThis, 'bunmagic')) {
	(globalThis as Record<string, unknown>).bunmagic = globals;
}

declare global {
	const $: typeof globals.$;
	const ansis: typeof globals.ansis;
	const path: typeof globals.path;
	const argv: typeof globals.argv;
	const args: typeof globals.args;
	const flags: typeof globals.flags;
	const select: typeof globals.select;
	const autoselect: typeof globals.autoselect;
	const getPassword: typeof globals.getPassword;
	const $spinner: typeof globals.$spinner;
	const cd: typeof globals.cd;
	const ack: typeof globals.ack;
	const ask: typeof globals.ask;
	const isDirectory: typeof globals.isDirectory;
	const ensureDirectory: typeof globals.ensureDirectory;
	const notMinimist: typeof globals.notMinimist;
	const Exit: typeof globals.Exit; // eslint-disable-line @typescript-eslint/naming-convention
	const $HOME: typeof globals.$HOME;
	const $get: typeof globals.$get;
	const glob: typeof globals.glob;
	const openEditor: typeof globals.openEditor;
	const slugify: typeof globals.slugify;
	const resolveTilde: typeof globals.resolveTilde;
	const cwd: typeof globals.cwd;
	const SAF: typeof globals.SAF;
	const die: typeof globals.die;
	const copyToClipboard: typeof globals.copyToClipboard;
	const CLI: typeof globals.CLI;
}

// export type ExtendedGlobal = typeof globalThis;
const customGlobalsFile = `${globals.$HOME}/.bunmagic/custom-globals.ts`;
if (await Bun.file(customGlobalsFile).exists()) {
	const customGlobals = await import(customGlobalsFile);
	Object.assign(globalThis, customGlobals);
}
