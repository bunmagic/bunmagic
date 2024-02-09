import { addSourceDirectory } from './link';
import { relinkBins } from './bins';
import { getSources } from '../lib/sources'

export const desc = "Check if bunshell is set up correctly";
export const usage = "bunshell doctor";

export default async function setup() {
	const PATH = Bun.env.PATH;
	const BIN_PATH = `${$HOME}/.bunshell/bin`

	let issues = 0;

	if (!PATH) {
		issues++;
		console.log("Your $PATH is not set.");
		console.log("Please set your $PATH to include the bin directory.");
		console.log(BIN_PATH);
	}

	if ((await getSources()).length === 0) {
		console.log("Welcome! Where should bunshell store your scripts?")
		await addSourceDirectory();
		await relinkBins();

		console.log("All done! If you want to add more source directories,")
		console.log(`run ${ansis.bold("bunshell link")}`);
	}

	if (PATH && !PATH.includes(BIN_PATH)) {
		issues++;
		console.log("Make sure that you've set up the $PATH correctly.");
		console.log(PATH);
		console.log(`Your $PATH should include ${BIN_PATH}`);
		return false;
	}

	if (issues === 0) {
		console.log("Your setup looks good!");
	} else {
		console.log(`Found ${issues} issue(s).`);
	}
}
