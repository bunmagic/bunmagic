import * as config from '../lib/config';
import { addSourceDirectory } from './link';

export const desc = "Install bunism and set up your environment";
export const usage = "bunism install";



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
	const rcFiles = [`${$HOME}/.zshrc`, `${$HOME}/.bashrc`, `${$HOME}/.profile`, `${$HOME}/.bash_profile`];
	return Promise.all(rcFiles.filter(f => Bun.file(f).exists()));
}
async function setupBinPath(binPath: string) {
	const rcFiles = await availableRcFiles();

	const select = [...rcFiles, "Custom"];
	let rcFile = selection(select, `Which file would you like to add bunism to?`);

	if (rcFile === "Custom") {
		const customFile = await require(async () => {
			const file = prompt("Enter the path to the file you'd like to add bunism to:")
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
	 Welcome to ${ansis.bold("bunism")}!
	${dimLine}
	
	 Reload the terminal and run ${ansis.bold("bunism")} to finish the setup process.
	
	 Some useful commands to get you started:
	 • ${ansis.bold("bunism help")} 			get the full list of available commands
	 • ${ansis.bold("bunism new my-script")} 	create your first script
	 • ${ansis.bold("bunism list")} 			see a list of scripts you've defined.

	 ${dimLine}`

	console.log(message.replace(/^\t/gm, '|'));
}

async function setupConfig(bmPath: string) {
	const configFile = `${bmPath}/config.json`;
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
	const confirm = ack("Are you sure you want to uninstall bunism?");
	if (!confirm) {
		return;
	}
	const rcFiles = await availableRcFiles();
	const binPath = `${$HOME}/.bunism/bin`;

	for (const file of rcFiles) {
		const content = await Bun.file(file).text();
		if (content.includes(binPath)) {
			await Bun.write(file, content.replace(`export PATH="${binPath}:$PATH"\n`, ""));
			console.log(`\n- Removed ${binPath} from ${file}`);
		}
	}


	cd($HOME);
	await $`rm -rf ${$HOME}/.bunism`;
	die(`Uninstalled bunism.`);
}

export default async function setup() {
	if (argv.remove || argv.uninstall || argv._[0] === "remove" || argv._[0] === "uninstall") {
		return await uninstall();
	}

	console.log(`\nInstalling ${ansis.bold("bunism")}...\n`);
	if (!Bun.env.PATH) {
		throw die("Can't find $PATH variable. Exiting.");
	}


	const bunism = await $`which bunism`.quiet().text();
	if (bunism.trim() !== "") {
		console.log("Installing bunism globally...");
		await $`bun install -g bunism/bunism`;
	} else {
		console.log("bunism is already installed globally.");
	}


	console.log(`\n- Setting up the necessary paths for bunism scripts to run.`);
	const bmPath = `${$HOME}/.bunism`;
	const binPath = path.join(bmPath, "bin");
	if (!Bun.env.PATH.includes(bmPath)) {
		await setupBinPath(binPath);
	}

	console.log(`\n- Setting up the bunism config file.`);
	await ensureDir(binPath);
	await setupConfig(bmPath);

	console.log(`\n- Setting up the script source directory.`);
	if (await config.get("sources") === undefined) {
		await addSourceDirectory();
	}

	const bmAliasBin = `${binPath}/bm`;
	const bmAliasQuestion = `\n- Do you want to setup ${ansis.bold("bm")} as a shortcut for ${ansis.bold("bunism")}?`;
	if (!await Bun.file(bmAliasBin).exists() && Bun.which("bm") === null && ack(bmAliasQuestion)) {
		await Bun.write(`${bmAliasBin}`, `#!/bin/bash\nbunism $@`);
		await $`chmod +x ${bmAliasBin}`;
		console.log(`\n- Created a new bin: ${ansis.bold("bm")} -> ${bmAliasBin} \n`);

	}


	// Welcome!
	await displayWelcomeMessage();


	console.log(`\n- Open a new terminal to reload your ${ansis.bold("$PATH")} variable to apply the changes.`);
}