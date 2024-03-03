# 🪄 Bun Magic
> Creating shell scripts has never been this easy!

Bun Magic simplifies shell scripting by providing a toolkit to create, use and manage scripts.

**Bun Magic in 15 seconds**
This is how you create a `demo` command and import `cowsay` from npm, and deliver an important message via the cow.

![demo](https://raw.githubusercontent.com/bunmagic/bunmagic/main/docs/assets/demo.gif)



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

Create a new **bunmagic** managed script by running.

I'll create an ls command that will list files only by your specified extension. Call it **lse**.
```
bunmagic lse
```

This will create a `lse.mjs` file in your directory and link it up as a bin so that you can run it from anywhere as `lse` command.

Now add in a bit script magic:

```js
const ext = argv._[0];
const ls = await glob(process.cwd(), `*.${ext}`);
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

Bun supports dynamic [package imports](https://bun.sh/docs/runtime/modules#importing-packages) out of the box. So you can use any npm package in your scripts:

```ts
import cowsay from 'cowsay';
console.log(cowsay.say({ text: 'Hello, Bunmagic!' }));
```

However, there are a few global variables that are useful for writing CLI scripts that come bundled with Bunmagic:

### `$` Bun Shell
Bun [Shell](https://bun.sh/docs/runtime/shell) is already imported as `$` globally.

### `argv` - Arguments
`argv` holds the arguments passed to your script. They're parsed by [`notMinimist`](./src/globals/not-minimist.ts) - an utility function that's inspired by [Minimist](https://www.npmjs.com/package/minimist). It takes care of most of common use cases.


```shell
$ example something nice --with --flags -n 10 --and=more --equal-sign is-optional
```
Produces an object like this:

```ts
{
  _: [ "something", "nice" ],
  with: true,
  flags: true,
  n: 10,
  and: "more",
  "equal-sign": "is-optional",
}
```
If you need more control over the arguments, you can use the `Bun.argv` array directly and parse the arguments using any `npm` package you like.

Using the same shell command above, the output of `Bun.argv` would be:
```ts
console.log(Bun.argv);
[
  "/Users/user/.bun/bin/bun", "/Users/user/.bun/bin/bunmagic-exec", "/Users/user/.bunmagic/default/not-minimist.ts",
  "not-minimist", "something", "nice", "--with", "--flags", "-n", "10", "--and=more", "--equal-sign",
  "is-optional"
]
```

### 🧰 Built-in Utilities

#### Ansis (an alternative to Chalk)

[ansis](https://www.npmjs.com/package/ansis) - is a small library for styling the terminal output. The interface is almost exactly the same as the one in [chalk](https://www.npmjs.com/package/chalk), but it's much smaller and faster:

```ts
ansis.red("This is red text");
ansis.bold.red.bgGreen("This is bold red text on a green background");
```

#### `$HOME`
The `$HOME` global variable is a shortcut for `os.homedir()`. It holds the absolute path to the current user's home directory.


#### `cd(path: string)`
`cd` is a wrapper around `$.cwd`, but it also resolves the tilde ( `~` ) to the home directory.

```ts
// These two are the exactly the same:
$.cwd(resolveTilde(path))
cd(path)
```


#### `ack(question: string, default: 'y' | 'n' = 'y')`
Out of the box, Bun provides `prompt()` inspired by the (`window.prompt`)[https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt]. `ack` is a wrapper around that, but for `Yes` or `No` questions.


#### `selection(options: string[], message: string)`
`selection` is a helper function that takes an array of strings as options and a message and provides an interactive selection prompt.

```ts
const options = ["one", "two", "three"];
const selected = await selection(options, "Select an option:");
console.log(selected);
```


#### `isDirectory(path: string)`
The `isDirectory` function is an asynchronous utility that checks if a given path points to a directory. It returns a promise that resolves to a boolean value: `true` if the path is a directory, and `false` otherwise.

Due to Bun's current limitations in directly checking if a path is a directory, this function utilizes Node.js's `fs.stat` method to perform the check. If an error occurs during this process (e.g., if the path does not exist), the promise will resolve to `false`. Otherwise, it resolves based on whether the path points to a directory.

#### `ensureDirectory(path: string)`
The `ensureDirectory` function is an asynchronous utility that ensures a given directory exists. If the directory does not exist, it will be created.

This function is particularly useful when you need to make sure a directory is present before performing file operations that require the directory's existence.


#### `glob(cwd: string, pattern: string = '*', options: GlobScanOptions = {})`
The `glob` function is an asynchronous utility that searches for files matching a specified pattern within a given directory (`cwd`). It returns a promise that resolves to an array of strings, each representing the absolute path to a file that matches the pattern.

**Parameters**:
- `cwd`: The current working directory in which to search for files.
- `pattern`: The glob pattern to match files against. Defaults to `*`, which matches all files.
- `options`: An optional [`GlobScanOptions`](https://github.com/oven-sh/bun/blob/49ccad9367b0a30158dbb03ff00bc9a523d43c14/packages/bun-types/bun.d.ts#L4669-L4709) object to customize the search behavior, with the following properties:
  - `cwd`: The root directory to start matching from. Defaults to `process.cwd()`.
  - `dot`: Allow patterns to match entries that begin with a period (`.`). Defaults to `false`.
  - `absolute`: Return the absolute path for entries. Defaults to `false`.
  - `followSymlinks`: Indicates whether to traverse descendants of symbolic link directories. Defaults to `false`.
  - `throwErrorOnBrokenSymlink`: Throw an error when a symbolic link is broken. Defaults to `false`.
  - `onlyFiles`: Return only files. Defaults to `true`.

**Returns**:
A promise that resolves to an array of strings, where each string is the absolute path to a file that matches the specified pattern.

## 🎨 Customization

### Custom Globals
The `customGlobals` feature allows you to extend the global namespace with your own custom variables or functions. This is particularly useful for adding utilities or configurations that you frequently use across your scripts.

To use `customGlobals`, create a file named `custom-globals.ts` in your `$HOME/.bunmagic` directory. In this file, you can export any JavaScript object, function, or variable that you wish to be available globally.

For example, to make `fs-extra` available in all your scripts by default, add this to  your `custom-globals.ts`:

```ts
export * as fs from 'fs-extra';
```

### Code Editor

`bunmagic` is going to try to use your `EDITOR` environment variable and fall back to **VSCode** as the editor when opening script files.

You must have [VSCode CLI Tools](https://code.visualstudio.com/docs/editor/command-line) installed for files to be opened automatically in VSCode.

In your shell configuration file, set an `EDITOR` environment variable:

```sh
# In .zshrc or .bashrc
export EDITOR="/usr/bin/vim"
```
 
**Note:**
VSCode supports both of these commands:
```sh
> code /path/to/scripts/my-script.mjs
> code /path/to/scripts
```

So if you want your editor to work properly, make sure it can accept both a path to a single script file and a path to a directory. 


## Credits

This project is heavily inspired by [zx](https://github.com/google/zx). It paved the way for a new generation of shell scripting, and Bun Shell made it possible to take it to the next level.

Bun Magic started out as [zxb](https://github.com/pyronaur/zxb) - a project I built to manage `zx` scripts. But. Bun Magic is a love child of zx, zxb and Bun.