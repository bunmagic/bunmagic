import { getSourceDirectories, addSourceDirectory } from './sources'
import { relinkBins } from './bins'

export default async function env_requirements() {
	const PATH = Bun.env.PATH;
	const BIN_PATH = `${os.homedir()}/.bunshell/bin`

	if (!PATH) {
		console.log("Your $PATH is not set.");
		console.log("Please set your $PATH to include the bin directory.");
		console.log(BIN_PATH);
		return false;
	}

	if ((await getSourceDirectories()).size === 0) {
		console.log("Welcome! Where should bunshell store your scripts?")
		await addSourceDirectory();
		await relinkBins();

		console.log("All done! If you want to add more source directories,")
		console.log(`run ${chalk.bold("bunshell add_source")}`);
	}

	if (!PATH.includes(BIN_PATH)) {
		console.log("Make sure that you've set up the $PATH correctly.");
		console.log(PATH);
		console.log(`Your $PATH should include ${BIN_PATH}`);
		return false;
	}


	return true;
}
