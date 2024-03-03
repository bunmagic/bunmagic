# 🪄 Bun Magic

*Easy script management with Bun*

**bunmagic** is a [Bun](https://bun.sh) script manager to help you write, use, edit and even share Bun scripts quickly.


## 🚀 Quick Start

1. Make sure you have [Bun installed](https://bun.sh/):

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

That's it!

## 🧻 Documentation

 **Available commands:**

 `bunmagic create <script-name>`
 Create a new script. Alias: `new`.

 `bunmagic edit [script-name]`
 Edit scripts. If no script name is specified, will open all scripts and the `~/.bunmagic` directory.

 `bunmagic remove <script-name>`
 Remove and unlink a script. Alias: `rm`.

 `bunmagic list`
 List all known scripts. Alias: `ls`.

 `bunmagic link`
 Add an additional directory to use as script source.

 `bunmagic unlink`
 Remove a directory from the script source list.

 `bunmagic update`
 Update bunmagic to the latest version.

 `bunmagic help`
 Get the full list of available commands.

 `bunmagic doctor`
 Check if bunmagic is set up correctly.

 `bunmagic reload [--force]`
 Reload your script files and ensure that they have an executable bin.

 `bunmagic version`
 Display the current version of bunmagic. Alias: `-v`.

 `bunmagic clean`
 Remove bin files from the bin directory that don't have a matching script.


## 🎨 Customization

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

