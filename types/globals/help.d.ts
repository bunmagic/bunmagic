/**
 * Display help information for the current script.
 * This function reads the JSDoc metadata from the calling script
 * and displays formatted help information.
 *
 * @example
 * if (flags.help) {
 *   await showHelp();
 *   throw new Exit(0);
 * }
 */
export declare function showHelp(): Promise<void>;
