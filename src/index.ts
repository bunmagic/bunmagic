import * as globals from "./globals";
Object.assign(globalThis, globals);

declare global {
	const $: typeof globals.$;
	const chalk: typeof globals.chalk;
	const fs: typeof globals.fs;
	const globby: typeof globals.globby;
	const os: typeof globals.os;
	const path: typeof globals.path;
	const argv: typeof globals.argv;
}