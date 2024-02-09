import * as config from '../lib/config';
import { addSourceDirectory } from './link';

export const desc = "Install bunshell and set up your environment";
export const usage = "bunshell install";



async function require<T>(callback: () => Promise<T>, attempts = 3): Promise<T> {
	while (attempts > 0) {
		try {
			return await callback();
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.message);
			} else {
				console.log(e);
			}
		}
		attempts--;
	}
	throw die("Failed to complete operation. Exiting.");
}

function availableRcFiles() {
	const rcFiles = [`${$HOME}/.bashrc`, `${$HOME}/.zshrc`, `${$HOME}/.profile`, `${$HOME}/.bash_profile`];
	return Promise.all(rcFiles.filter(f => Bun.file(f).exists()));
}
async function setupBinPath(binPath: string) {
	const rcFiles = await availableRcFiles();

	const select = [...rcFiles, "Custom"];
	let rcFile = selection(select, `Which file would you like to add bunshell to?`);

	if (rcFile === "Custom") {
		const customFile = await require(async () => {
			const file = prompt("Enter the path to the file you'd like to add bunshell to:")
			if (!file) {
				throw "No file path provided";
			}
			if (! await Bun.file(file).exists()) {
				throw `File not found: ${file}`;
			}
			return file;
		});
		rcFile = customFile;
	}

	const rcContent = await Bun.file(rcFile).text();

	if (!rcContent.includes(binPath)) {
		await Bun.write(rcFile, `${rcContent}\nexport PATH="${binPath}:$PATH"\n`);
	}
}

async function displayWelcomeMessage() {
	const dimLine = ansis.dim("===============================================================");
	const message = `
	${dimLine}
	 Welcome to ${ansis.bold("bunshell")}!
	${dimLine}
	
	 Reload the terminal and run ${ansis.bold("bunshell")} to finish the setup process.
	
	 Some useful commands to get you started:
	 • ${ansis.bold("bunshell help")} 			get the full list of available commands
	 • ${ansis.bold("bunshell new my-script")} 	create your first script
	 • ${ansis.bold("bunshell list")} 			see a list of scripts you've defined.

	 ${dimLine}`

	console.log(message.replace(/^\t/gm, '|'));
}

async function setupConfig(bsPath: string) {
	const configFile = `${bsPath}/config.json`;
	if (await Bun.file(configFile).exists()) {
		return;
	}
	const defaultExtension = selection<config.SupportedFiles>([...config.SUPPORTED_FILES], "What file extension would you like to use for your scripts?");
	const defaults: config.Config = {
		extension: defaultExtension,
	};
	config.set(defaults);
}

export async function uninstall() {
	const confirm = ack("Are you sure you want to uninstall bunshell?");
	if (!confirm) {
		return;
	}
	const rcFiles = await availableRcFiles();
	const binPath = `${$HOME}/.bunshell/bin`;

	for (const file of rcFiles) {
		const content = await Bun.file(file).text();
		if (content.includes(binPath)) {
			await Bun.write(file, content.replace(`export PATH="${binPath}:$PATH"\n`, ""));
			console.log(`\n- Removed ${binPath} from ${file}`);
		}
	}


	cd($HOME);
	await $`rm -rf ${$HOME}/.bunshell`;
	die(`Uninstalled bunshell.`);
}

export default async function setup() {

	if (argv.remove || argv.uninstall || argv._[0] === "remove" || argv._[0] === "uninstall") {
		return await uninstall();
	}

	console.log(`\nInstalling ${ansis.bold("bunshell")}...\n`);
	if (!Bun.env.PATH) {
		throw die("Can't find $PATH variable. Exiting.");
	}


	if (Bun.which("bunshell") === null) {
		console.log("Installing bunshell globally...");
		await $`bun install -g bunshell/bunshell`;
	} else {
		console.log("Bunshell is already installed globally.");
	}


	console.log(`\n- Setting up the necessary paths for bunshell scripts to run.`);
	const bsPath = `${$HOME}/.bunshell`;
	const binPath = path.join(bsPath, "bin");
	if (!Bun.env.PATH.includes(bsPath)) {
		await setupBinPath(binPath);
	}

	console.log(`\n- Setting up the bunshell config file.`);
	await ensureDir(binPath);
	await setupConfig(bsPath);

	console.log(`\n- Setting up the script source directory.`);
	if (await config.get("sources") === undefined) {
		await addSourceDirectory();
	}

	const bsAliasBin = `${binPath}/bs`;
	const bsAliasQuestion = `\n- Do you want to setup ${ansis.bold("bs")} as a shortcut for ${ansis.bold("bunshell")}?`;
	if (!await Bun.file(bsAliasBin).exists() && Bun.which("bs") === null && ack(bsAliasQuestion)) {
		await Bun.write(`${bsAliasBin}`, `#!/bin/bash\nbunshell $@`);
		await $`chmod +x ${bsAliasBin}`;
		console.log(`\n- Created a new bin: ${ansis.bold("bs")} -> ${bsAliasBin} \n`);

	}


	// Welcome!
	await displayWelcomeMessage();


	console.log(`\n- Open a new terminal to reload your ${ansis.bold("$PATH")} variable to apply the changes.`);
}