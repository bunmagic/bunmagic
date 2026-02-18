/**
 * Install bunmagic and set up your environment
 * @autohelp
 */
import * as config from '@lib/config';
import { setupAlias } from '@lib/setup';
import { editFile } from '../files';
import { addSourceDirectory } from './link';

async function require<T>(callback: () => Promise<T>, attempts = 3): Promise<T> {
	while (attempts > 0) {
		try {
			return await callback();
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			} else {
				console.log(error);
			}
		}

		attempts--;
	}

	throw new Exit('Failed to complete operation. Exiting.');
}

async function filterAsync<T>(array: T[], callback: (item: T) => Promise<boolean>) {
	const results = await Promise.all(array.map(async index => callback(index)));
	return array.filter((_v, index) => results[index]);
}

async function availableRcFiles() {
	const rcFiles = [
		`${$HOME}/.zshrc`,
		`${$HOME}/.bashrc`,
		`${$HOME}/.profile`,
		`${$HOME}/.bash_profile`,
	];
	return filterAsync(rcFiles, async file => Bun.file(file).exists());
}

async function setupBinaryPath(binaryPath: string) {
	const rcFiles = await availableRcFiles();

	const availablePaths = [...rcFiles, 'Custom'];
	let rcFile = await select('Which file would you like to add bunmagic to?', availablePaths);

	if (rcFile === 'Custom') {
		const customFile = await require(async () => {
			const file = prompt("Enter the path to the file you'd like to add bunmagic to:");
			if (!file) {
				throw new Exit('No file path provided');
			}

			if (!(await Bun.file(file).exists())) {
				throw new Exit(`File not found: ${file}`);
			}

			return file;
		});
		rcFile = customFile;
	}

	const rcContent = await Bun.file(rcFile).text();

	if (!rcContent.includes(binaryPath)) {
		await Bun.write(rcFile, `${rcContent}\nexport PATH="${binaryPath}:$PATH"\n`);
	}
}

async function displayWelcomeMessage() {
	const dimLine = ansis.dim('===============================================================');
	const message = `
	${dimLine}
	 Welcome to ${ansis.bold('bunmagic')}!
	${dimLine}
	
	 Reload the terminal and run ${ansis.bold('bunmagic')} to finish the setup process.
	
	 Some useful commands to get you started:
	 • ${ansis.bold('bunmagic help')} 			get the full list of available commands
	 • ${ansis.bold('bunmagic new my-script')} 	create your first script
	 • ${ansis.bold('bunmagic list')} 			see a list of scripts you've defined.

	 ${dimLine}`;

	console.log(message.replaceAll(/^\t/gm, '|'));
}

async function setupConfig(bmPath: string) {
	const configFile = `${bmPath}/config.json`;
	if (await Bun.file(configFile).exists()) {
		return;
	}

	const defaultExtension = await select<config.SupportedFiles>(
		'What file extension would you like to use for your scripts?',
		config.SUPPORTED_FILES,
	);
	const defaults: config.Config = {
		extension: defaultExtension,
	};
	await config.set(defaults);
}

export async function uninstall() {
	const confirm = ack('Are you sure you want to uninstall bunmagic?');
	if (!confirm) {
		return;
	}

	const rcFiles = await availableRcFiles();
	const binaryPath = `${$HOME}/.bunmagic/bin`;

	for (const file of rcFiles) {
		await editFile(file, content => {
			if (content.includes(binaryPath)) {
				console.log(`\n- Removed ${binaryPath} from ${file}`);
				return content.replace(`export PATH="${binaryPath}:$PATH"\n`, '');
			}

			return content;
		});
	}

	cd($HOME);
	await $`rm -rf ${$HOME}/.bunmagic`;
	throw new Exit('Uninstalled bunmagic.');
}

export default async function setup() {
	if (flags.remove || flags.uninstall || args[0] === 'remove' || args[0] === 'uninstall') {
		await uninstall();
		return;
	}

	console.log(`\nInstalling ${ansis.bold('bunmagic')}...\n`);
	if (!Bun.env.PATH) {
		throw new Exit("Can't find $PATH variable. Exiting.");
	}

	const existingMagic = await $`which bunmagic`.quiet().text();
	if (existingMagic.trim() === '') {
		console.log('bunmagic is already installed globally.');
	} else {
		console.log('Installing bunmagic globally...');
		await $`bun install -g bunmagic`;
	}

	console.log('\n- Setting up the necessary paths for bunmagic scripts to run.');
	const bmPath = `${$HOME}/.bunmagic`;
	const binaryPath = path.join(bmPath, 'bin');
	if (!Bun.env.PATH.includes(bmPath)) {
		await setupBinaryPath(binaryPath);
	}

	console.log('\n- Setting up the bunmagic config file.');
	await ensureDirectory(binaryPath);
	await setupConfig(bmPath);

	console.log('\n- Setting up the script source directory.');
	if ((await config.get('sources')) === undefined) {
		await addSourceDirectory();
	}

	await setupAlias(binaryPath);

	// Welcome!
	await displayWelcomeMessage();

	console.log(
		`\n- Open a new terminal to reload your ${ansis.bold('$PATH')} variable to apply the changes.`,
	);
}
