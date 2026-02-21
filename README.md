# 🪄 Bun Magic

Creating shell scripts has never been this easy!

Bun Magic simplifies shell scripting by providing a toolkit to create, use and manage scripts.

**Bun Magic in 15 seconds**
This is how you create a `demo` command and import `cowsay` from npm, and deliver an important message via the cow.

![demo](https://raw.githubusercontent.com/bunmagic/bunmagic/main/resources/assets/demo.gif)

## 🧙‍♂️ Overview

* **Create** new scripts with `bunmagic create <script-name>`.
* **List** all known scripts with `bunmagic list`
* **Edit** scripts with `bunmagic <script-name>`
* **No imports needed!** All Bunmagic utilities are available as globals (e.g., `$`, `cd`, `ack`, `select`, `isDirectory`, `glob`, and more).
* Use the **built-in utilities** for common CLI tasks without any import statements.
* Leverage **Bun** to quickly build powerful scripts using all the features that bun provides - run shell commands, import npm packages, and more.

## 🚀 Install

1. Make sure you have [Bun](https://bun.sh/) installed:

```
curl -fsSL https://bun.sh/install | bash
```

2. Install **bunmagic**

```
bunx bunmagic install
```

3. Reload terminal and run `bunmagic` for the first time. Done!

### 🤖 Your first script

Let's create a simple script called **lse**.

```sh
bunmagic lse
# or
bunmagic create lse
```

This will create a `lse.ts` file in bunmagic source directory and link it up as a bin so that you can run it from anywhere as `lse` command.

Now add in a bit script:

```js
// No imports needed! All bunmagic utilities are available globally
const ext = args[0];
const ls = await glob(`*.${ext}`);
console.log(ls.join("\n"));
```

Now you can run `lse json` to list all the json files in your current directory.

Bunmagic is going to handle creating a binary and making sure it's executable for you.

## 👾 Commands

 **Available commands:**

| Command                      | Description                                                                 | Alias       |
|------------------------------|-----------------------------------------------------------------------------|-------------|
| `bunmagic create <script-name>` | Create a new script.                                                        | `new`       |
| `bunmagic edit [script-name]`   | Edit scripts. Opens all scripts and the `~/.bunmagic` directory if no name is specified. |             |
| `bunmagic remove <script-name>` | Remove and unlink a script.                                                 | `rm`        |
| `bunmagic list`                  | List all known scripts.                                                     | `ls`        |
| `bunmagic link`                  | Add an additional directory to use as script source.                        |             |
| `bunmagic unlink`                | Remove a directory from the script source list.                             |             |
| `bunmagic update`                | Update bunmagic to the latest version.                                      |             |
| `bunmagic help`                  | Get the full list of available commands.                                    |             |
| `bunmagic doctor`                | Check if bunmagic is set up correctly.                                      |             |
| `bunmagic reload [--force]`      | Reload your script files and ensure that they have an executable bin.       |             |
| `bunmagic version`               | Display the current version of bunmagic.                                    | `-v`        |
| `bunmagic clean`                 | Remove bin files from the bin directory that don't have a matching script.  |             |


## 📦 API

### 🌍 Everything is Global!

**This is a key feature of Bunmagic:** All utilities and helpers are available as global variables in your scripts. You don't need to import anything to use `$`, `args`, `flags`, `cd`, `ack`, `select`, `glob`, and all other Bunmagic utilities. They're just there, ready to use!

```ts
// No imports needed for Bunmagic utilities!
await $`echo "Shell commands with $"`;
const files = await glob("*.json");
const choice = await select("Pick one:", files);
cd("~/projects");
```

Bun also supports dynamic [package imports](https://bun.sh/docs/runtime/modules#importing-packages) out of the box. So you can use any npm package in your scripts:

```ts
import cowsay from 'cowsay';
console.log(cowsay.say({ text: 'Hello, Bunmagic!' }));
```


### `$` Bun Shell

Bun [Shell](https://bun.sh/docs/runtime/shell) is available as `$` globally. Use this to run all your shell commands as you would in Bun.

### Arguments

Arguments passed to the script are available in 3 global variables:

* `args` - an array of arguments without flags.
* `flags` - an object with all the flags passed to the script.
* `argv` - a minimist-like object with all the arguments and flags.

For typed reads, use singular accessors:

```ts
const retries = flag("retries").int().default(3);
const mode = flag("mode").enum("fast", "safe").required();
const input = arg(0).string().required();
```

Typed helpers available on both accessors:
* `.string()`
* `.int()`
* `.number()`
* `.boolean()`
* `.enum("a", "b", ...)`

Chain form is also supported:

```ts
const retries = flag("retries").int().default(3);
const dryRun = flag("dry").boolean().optional();
```

`.optional()` returns `undefined` when missing. `args` remains a plain array and `flags` remains a plain object.

Arguments are parsed by [`notMinimist`](./src/globals/not-minimist.ts) - a tiny utility that's inspired by [Minimist](https://www.npmjs.com/package/minimist), but with a smaller footprint.
Flag values consume one token (`--name value`) or an inline value (`--name=value`). For multi-word values, quote them in your shell (`--name "hello world"`).

**Example:**

```shell
$ example one two --not=false --yes -n 10 --equals is-optional
```

Produces an object like this:

```ts
const args = [ "one", "two" ];
const flags = {
  not: false,
  yes: true,
  n: 10,
  equals: "is-optional",
}

// Minimist-like `argv` object:
const argv = {
  _: args,
  ...flags
};
```

If you need more control over the arguments, you can use the `Bun.argv` array directly and parse the arguments using any `npm` package you like.

Using the same shell command above, the output of `Bun.argv` would be:

```ts
console.log(Bun.argv);
[
  "/Users/user/.bun/bin/bun", "/Users/user/.bun/bin/bunmagic-exec", "/Users/user/.bunmagic/default/example.ts",
  "example", "one", "two", "--not=false", "--yes", "-n", "10", "--equals", "is-optional"
]
```

### 🧰 Built-in Utilities

All the utilities below are available as global variables in your scripts - no imports needed!

#### Ansis (an alternative to Chalk)

[ansis](https://www.npmjs.com/package/ansis) - is a small library for styling the terminal output. The interface is almost exactly the same as the one in [chalk](https://www.npmjs.com/package/chalk), but it's much smaller and faster:

```ts
ansis.red("This is red text");
ansis.bold.red.bgGreen("This is bold red text on a green background");
```

#### $HOME

The `$HOME` global variable is a shortcut for `os.homedir()`. It holds the absolute path to the current user's home directory. 

#### resolveTilde

`resolveTilde(path: string): string`

If you need to quickly resolve a path that starts with a tilde ( `~` ), you can use the `resolveTilde` function. It replaces the tilde with the absolute path to the current user's home directory.

```ts
const resolvedPath = resolveTilde("~/my-file.txt");
console.log(resolvedPath);
// > /Users/user/my-file.txt
```


#### cd

`cd(path: string): void`

`cd` is a wrapper around `$.cwd`, but it also resolves the tilde ( `~` ) to the home directory.

```ts
// All these are equivalent
$.cwd(`${$HOME}/my-folder`)
$.cwd(resolveTilde(`~/my-folder`))
cd(`~/my-folder`)
```


#### ack

A prompt to ask a Yes or No question.

Interface: `ack(message: string, default: 'y' | 'n'): Promise<boolean>`

Out of the box, Bun provides [`prompt()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) and [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) functions Web APIs.

`ack` works exactly like `confirm`, but allows you to change the default value to `y` or `n`.


#### select

Show a selection prompt that allows selecting an option from a list. It's an interactive CLI menu that can be navigated using arrow keys or numbers and has simple fuzzy search built-in.

Interface: `select(message: string, options: string[]): Promise<string>`

```ts
const options = ["one", "two", "three"];
const selected = await select("Select an option:", options);
```


### 🗄️ Filesystem Utilities

All filesystem utilities are available as global functions - no imports needed!

If you need to interact with the filesystem a lot, `fs-extra` is great, but I've only found that often I need only a few key functions.

That's why I've included only a handful of functions that I've found to be the most useful.

#### isDirectory

`isDirectory(path: string): Promise<boolean>`

Due to Bun's ( v1.0.26 ) current limitations in directly checking if a path is a directory, this function utilizes Node.js's `fs.stat` method to perform the check. If an error occurs during this process (e.g., if the path does not exist), the promise will resolve to `false`. Otherwise, it resolves based on whether the path points to a directory.

#### ensureDirectory

Create a directory (recursively) if it doesn't exist.

Interface: `ensureDirectory(path: string): Promise<void>`

This function is particularly useful when you need to make sure a directory is present before performing file operations that require the directory's existence.


#### glob

`glob(pattern: string = '*', options: GlobScanOptions = {}): Promise<string[]>` ( [`GlobScanOptions`](https://github.com/oven-sh/bun/blob/49ccad9367b0a30158dbb03ff00bc9a523d43c14/packages/bun-types/bun.d.ts#L4669-L4709) )

This is a shortcut for [`new Bun.Glob()`](https://bun.sh/docs/api/glob) that allows you to quickly scan a directory and get a list of files that match a pattern. 

**Mind The Path**:
Bun.Glob() uses `process.cwd()` by default. If you change paths during the script, `Bun.Glob()` will always return the files relative to the original path. `glob()` will always use the current working directory.

**Mind the Performance**:
`glob()` is a great quick utility for smaller scripts, but it will scan the entire directory before resolving the promise. If large directories are involved, it's better to use `new Bun.Glob()` directly.


## 🎨 Customization

### Custom Globals


If there are any utilities that you'd like to reuse across your Bunmagic scripts, you can add configure them as custom globals.

This is especially useful if you're migrating over from `zx` and have a lot of scripts that used some utilities that aren't bundled with Bunmagic, like `fs-extra`, `chalk`, etc.

To define custom globals, create a file: `~/.bunmagic/custom-globals.ts`

In this file, you can export any JavaScript object, function, or variable that you wish to be available globally and it will be assigned to `globalThis` in all your scripts.

For example, to make `fs-extra` available in all your scripts by default, add this to your `custom-globals.ts`:

```ts
export * as fs from 'fs-extra';
```

### Environment Variables

#### `BUNMAGIC_STRICT`

By default, when you run a command that doesn't exist, bunmagic will offer to create it for you. Set `BUNMAGIC_STRICT=1` to disable this behavior and exit with an error instead.

```sh
# Exit with error for invalid commands instead of prompting to create
BUNMAGIC_STRICT=1 my-command

# Or export it for the entire session
export BUNMAGIC_STRICT=1
```

This is particularly useful in CI/CD environments or production scripts where you want commands to fail fast if they don't exist.

### Code Editor

`bunmagic` is going to try to use your `EDITOR` environment variable and fall back to `code` as the editor when opening script files.

If you're using VSCode must have [VSCode CLI Tools](https://code.visualstudio.com/docs/editor/command-line) installed for files to be opened automatically in VSCode.

In your shell configuration file, set an `EDITOR` environment variable:

```sh
# In .zshrc or .bashrc
export EDITOR="/usr/bin/vim"
```
 
**Note:**
VSCode supports both of these commands and Bunmagic will use them to open either a single script or a script directory:

```sh
> code /path/to/scripts/my-script.ts
> code /path/to/scripts
```

If you want your editor to work properly, make sure it can accept both a path to a single script file and a path to a directory. 


## Credits

This project is heavily inspired by [zx](https://github.com/google/zx). It paved the way for a new generation of shell scripting, and Bun Shell made it possible to take it to the next level.

Bun Magic started out as [zxb](https://github.com/pyronaur/zxb) - a project I built to manage `zx` scripts. But. Bun Magic is a love child of zx, zxb and Bun.
