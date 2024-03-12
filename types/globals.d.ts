/// <reference types="node" />
import * as globals from './index';
declare global {
    const $: typeof globals.$;
    const ansis: typeof globals.ansis;
    const path: typeof globals.path;
    const argv: typeof globals.argv;
    const args: typeof globals.args;
    const flags: typeof globals.flags;
    const select: typeof globals.select;
    const cd: typeof globals.cd;
    const ack: typeof globals.ack;
    const isDirectory: typeof globals.isDirectory;
    const ensureDirectory: typeof globals.ensureDirectory;
    const notMinimist: typeof globals.notMinimist;
    const Exit: typeof globals.Exit;
    const $HOME: typeof globals.$HOME;
    const $get: typeof globals.$get;
    const glob: typeof globals.glob;
}
