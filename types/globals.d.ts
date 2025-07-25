import * as globals from './index';
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
    const Exit: typeof globals.Exit;
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
    const showHelp: typeof globals.showHelp;
    const $stdin: typeof globals.$stdin;
}
