const bunshell = `${os.homedir()}/.bunshell`

/**
 * 
 * This is a standalone zx file for installing and updating bunshell.
 * 
 */




async function setupPath() {
	const PATH = process.env.PATH;
	const BIN_PATH = `${os.homedir()}/.bunshell/bin`;
	const BIN_PATH_STRING = `export PATH=~/.bunshell/bin:$PATH`

	if (PATH.includes(BIN_PATH)) {
		console.log("  bunshell directory is already installed in $PATH");
		return true;
	}

	const rcfile = [
		os.homedir() + "/.zshrc",
		os.homedir() + "/.bashrc"
	].find(fs.pathExistsSync);



	let pathQuestion = ``
	pathQuestion += `\n\n`
	pathQuestion += `In order for bunshell to work, you'll need to update your $PATH variable.`
	pathQuestion += `\n\n`
	pathQuestion += `Add the following code to your $PATH:`
	pathQuestion += "\n\n\n"
	pathQuestion += `	${BIN_PATH_STRING}`
	pathQuestion += `\n\n\n`
	if (rcfile) {
		pathQuestion += `Append to "${rcfile}" automatically? (Y/n)`
		pathQuestion += `\n> `
	}

	let append = await question(pathQuestion)

	if (!append) {
		append = "y";
	}

	if (append.toLowerCase() !== "y") {
		console.log("Ok. Will not append to $PATH.")
		return;
	}

	const rcContent = fs.readFileSync(rcfile, 'utf8');

	if (rcContent.includes(BIN_PATH_STRING)) {
		console.log(`\nWhoops! Looks like the path already exists in ${rcfile}\n`);
		console.log(`And yet its' not found in your $PATH variable. Are you sure ${rcfile} is loaded?`)
		return;
	}

	await $`echo ${BIN_PATH_STRING} >> ${rcfile}`
	console.log(`Appended ${BIN_PATH_STRING} to $PATH.\nReload the terminal and you're good to go!`)
}

async function createBunshellAlias() {
	if (await fs.pathExists(`${bunshell}/bin/bunshell`)) {
		console.log(`  bunshell already exists in ${bunshell}/bin/bunshell`)
		return;
	}

	const template = `
		#!/bin/bash
		~/.bunshell/bunshell.mjs $@
		`.split("\n")
		.map(s => s.trim())
		.join("\n")
		.trim("\n")
	await $`echo ${template} >> ${bunshell}/bin/bunshell`
	await $`chmod +x ${bunshell}/bin/bunshell`

}

async function download(url) {
	if (await $`which wget`.exitCode == 0) {
		return await $`wget -q ${url} -O latest.zip`
	}
	if (await $`which curl`.exitCode == 0) {
		return await $`curl -L ${url} --output latest.zip`
	}

	console.error("Can't find neither `wget` nor `curl` on your system to download the bunshell §zip file.")
	process.exit(1);
}

async function installLatestRelease() {
	const releaseUrl = "https://github.com/pyronaur/bunshell/releases/latest/download/latest.zip";

	cd(bunshell)
	await download(releaseUrl);
	await $`unzip -o latest.zip -d .`
	await $`rm latest.zip`
	await fs.ensureDir(`${bunshell}/bin`)
	await fs.ensureDir(`${bunshell}/sources`)

}

async function displayWelcomeMessage() {
	const grayLine = chalk.gray("===============================================================");
	const message = `
	${grayLine}
	 Welcome to ${chalk.bold("bunshell")}!
	${grayLine}
	
	 Reload the terminal and run ${chalk.bold("bunshell")} to finish the setup process.
	
	 Some useful commands to get you started:
	 • ${chalk.bold("bunshell help")} 		get the full list of available commands
	 • ${chalk.bold("bunshell new my-script")} 	create your first script
	 • ${chalk.bold("bunshell list")} 		see a list of scripts you've defined.

	 ${grayLine}`

	console.log(message.replace(/^\t/gm, '|'));
}

const verbose = BUNS.verbose;
BUNS.verbose = false;
const zx_version = await $`zx --version`
BUNS.verbose = verbose;


if (parseInt(zx_version.toString()[0]) < 7) {
	console.error(`Please update ${chalk.bold("zx")} to version 7 or higher to use ${chalk.bold("bunshell")}.`)
	process.exit();
}

/**
 * 🚀
 * This is a file that can be run directly to perform bunshell installation
 * But we also want to reuse some of that code to update bunshell.
 * 
 * That's why this is is a necessary side-effect:
 */

// Turn off verbose mode by default
BUNS.verbose = argv.verbose || false;
if (argv.update) {
	await installLatestRelease();
} else {
	await fs.ensureDir(`${bunshell}/bin`);

	console.log(`\nInstalling ${chalk.bold("bunshell")}...\n`);

	console.log(`\n- Setting up the necessary paths for bunshell scripts to run.`);
	await setupPath();

	console.log(`\n- Installing latest version of ${chalk.bold("bunshell")} from GitHub...`)
	await installLatestRelease();

	console.log(`\n- Adding bunshell executable`)
	await createBunshellAlias();

	// Welcome!
	await displayWelcomeMessage();
}




