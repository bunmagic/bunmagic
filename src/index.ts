import * as globals from "./globals";

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
	const chalk: typeof globals.chalk;
	const globby: typeof globals.globby;
	const os: typeof globals.os;
	const path: typeof globals.path;
	const argv: typeof globals.argv;
	const selection: typeof globals.selection;
	const cd: typeof globals.cd;
	const ack: typeof globals.ack;
	const isDir: typeof globals.isDir;
	const ensureDir: typeof globals.ensureDir;
}
