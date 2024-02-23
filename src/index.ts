import * as globals from './globals/index';

const BUNS_GLOBAL = {
	verbose: true,
};

Object.assign(globalThis, {
	...globals,
	BUNS: BUNS_GLOBAL,
});

declare global {
	const BUNS: typeof BUNS_GLOBAL;
	const $: typeof globals.$;
	const ansis: typeof globals.ansis;
	const path: typeof globals.path;
	const argv: typeof globals.argv;
	const selection: typeof globals.selection;
	const cd: typeof globals.cd;
	const ack: typeof globals.ack;
	const isDirectory: typeof globals.isDirectory;
	const ensureDirectory: typeof globals.ensureDirectory;
	const notMinimist: typeof globals.notMinimist;
	const Exit: typeof globals.Exit; // eslint-disable-line @typescript-eslint/naming-convention
	const os: typeof globals.os;
	const $HOME: typeof globals.$HOME;
	const $get: typeof globals.$get;
}

const customGlobalsFile = `${$HOME}/.bunmagic/custom-globals.ts`;
if (await Bun.file(customGlobalsFile).exists()) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const customGlobals = await import(customGlobalsFile);
	Object.assign(globalThis, customGlobals);
}
