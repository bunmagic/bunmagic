import * as globals from "./globals/index";

const BUNS_GLOBAL = {
	verbose: true
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
	const isDir: typeof globals.isDir;
	const ensureDir: typeof globals.ensureDir;
	const notMinimist: typeof globals.notMinimist;
	const die: typeof globals.die;
	const os: typeof globals.os;
	const $HOME: typeof globals.$HOME;
}

const customGlobalsFile = `${os.homedir()}/.bunism/custom-globals.ts`;
if (await Bun.file(customGlobalsFile).exists()) {
	const customGlobals = await import(customGlobalsFile);
	Object.assign(globalThis, customGlobals);
}