import { PATHS } from '@lib/config';
import { slugify } from '@lib/utils';

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
	usage: { name: string; description: string } | undefined;

	/**
	 * A list of aliases for the command.
	 * Creates bin files for each alias.
	 */
	alias: string[];

	namespace: string | undefined;

	meta?: Record<string, Array<{ name: string; description: string }>>;

	constructor({
		source,
		namespace,
		slug,
		desc,
		usage,
		alias,
		meta,
	}: {
		source: string;
		namespace?: string;
		slug?: string;
		desc?: string;
		usage?: { name: string; description: string };
		alias?: string[];
		meta?: Record<string, Array<{ name: string; description: string }>>;
	}) {
		this.source = source;
		this.slug = slugify(slug ?? path.parse(source).name);
		this.command = namespace ? `${namespace} ${this.slug}` : this.slug;
		this.bin = `${PATHS.bins}/${this.slug}`;
		this.desc = desc;
		this.usage = usage;
		this.alias = alias ?? [];
		this.namespace = namespace;
		this.meta = meta;
	}

	/**
	 * The filename, for example:
	 * `my-command.js`
	 */
	get filename() {
		return path.basename(this.source);
	}

	/**
	 * The directory path, for example:
	 * `/path/to/dir `
	 */
	get dir() {
		return path.dirname(this.source);
	}
}
