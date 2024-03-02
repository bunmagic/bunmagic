
export class Script {
	public readonly type = 'script' as const;
	/**
	 * The command name, for example:
	 * `my-command`
	 */
	slug: string;
	/**
	 * The full command name, for example:
	 * `my-namespace my-command`
	 */
	command: string;
	/**
	 * The full path to the bin file, for example
	 * `~/.bunmagic/bins/my-command`
	 */
	bin: string;
	/**
	 * The directory path, for example:
	 * `/path/to/dir `
	 */
	dir: string;
	/**
	 * The filename, for example:
	 * `my-command.js`
	 */
	filename: string;
	/**
	 * The full source path, for example:
	 * `/path/to/dir/my-command.js`
	 */
	source: string;

	/**
	 * A description of the command.
	 * Used in the help command.
	 */
	desc: string | undefined;

	/**
	 * A usage example of the command.
	 * Used in the help command.
	 */
	usage: string | undefined;

	/**
	 * A list of aliases for the command.
	 * Creates bin files for each alias.
	 */
	alias: string[];
	constructor({
		source,
		filename,
		command,
		bin,
		dir,
		slug,
		desc,
		usage,
		alias,
	}: {
		source: string;
		filename: string;
		command: string;
		bin: string;
		dir: string;
		slug: string;
		desc?: string;
		usage?: string;
		alias?: string[];
	}) {
		this.source = source;
		this.filename = filename;
		this.command = command;
		this.bin = bin;
		this.dir = dir;
		this.slug = slug;
		this.desc = desc;
		this.usage = usage;
		this.alias = alias ?? [];
	}
}
