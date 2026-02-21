import * as globals from './index';

Object.assign(globalThis, {
	...globals,
	// Allow explicit globals reference via `bunmagic` prefix.
	bunmagic: globals,
});

declare global {
	const $: typeof globals.$;
	const ansis: typeof globals.ansis;
	const path: typeof globals.path;
	const argv: typeof globals.argv;
	const args: typeof globals.args;
	const flags: typeof globals.flags;
	const arg: typeof globals.arg;
	const flag: typeof globals.flag;
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
	const files: typeof globals.files;
	const openEditor: typeof globals.openEditor;
	const slugify: typeof globals.slugify;
	const resolveTilde: typeof globals.resolveTilde;
	const cwd: typeof globals.cwd;
	const SAF: typeof globals.SAF;
	const die: typeof globals.die;
	const copyToClipboard: typeof globals.copyToClipboard;
	const CLI: typeof globals.CLI;
	const showHelp: typeof globals.showHelp;
	const $stdin: typeof globals.$stdin;
}

// export type ExtendedGlobal = typeof globalThis;
const customGlobalsFile = `${globals.$HOME}/.bunmagic/custom-globals.ts`;
if (await Bun.file(customGlobalsFile).exists()) {
	const customGlobals = await import(customGlobalsFile);
	Object.assign(globalThis, customGlobals);
}
