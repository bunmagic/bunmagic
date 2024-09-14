type Subcommand<Arguments, ReturnValue> = (...parameters: Arguments[]) => Promise<ReturnValue>;

class Subcommands<
	Callback,
	Config extends Record<string, Callback>,
	Name extends keyof Config = keyof Config,
> {
	private readonly _commands: Config;
	constructor(commands: Config) {
		this._commands = commands;
	}

	public name(commandName: string): Name {
		if (commandName in this._commands) {
			return commandName as Name;
		}

		throw new Error(`Invalid command. Valid commands are: ${Object.keys(this._commands).join(', ')}`);
	}

	public get<N extends Name>(commandName?: N): Config[N];
	public get<F extends Name>(commandName: string | undefined, fallback: F): Config[F];
	public get<N extends Name, F extends Name>(commandName?: N, fallback?: F): Config[Name] {
		if (commandName && commandName in this._commands) {
			return this._commands[commandName];
		}

		if (fallback && fallback in this._commands) {
			return this._commands[fallback];
		}

		throw new Error(`Invalid command. Valid commands are: ${Object.keys(this._commands).join(', ')}`);
	}

	public get commands(): Name[] {
		return Object.keys(this._commands) as Name[];
	}

	public maybeHelp() {
		if (flags.help) {
			console.log('Available commands:');
			for (const command of this.commands) {
				console.log(ansis.cyan(`  • ${command as string}`));
			}

			throw new Exit(0);
		}

		return this;
	}
}

/**
 * TypeScript doesn't support partial type inference,
 * So we need to use a factory function to create the subcommands.
 */
export function subcommandFactory<
	Arguments = unknown[],
	ReturnValue = void,
>() {
	return <
		Name extends string,
		Config extends Record<Name, Subcommand<Arguments, ReturnValue>>,
	>(
		commands: Config,
	) => new Subcommands(commands);
}

export const subcommands = subcommandFactory();
