import { relinkBins } from "../bins";

commandInfo.link = {
	desc: "Ensure all your script files have an executable in the bin directory.",
	usage: `bunshell link [--force]`,
};


async function link() {
	if (await relinkBins()) {
		console.log("\nDone!");
	} else {
		console.log("All executables are already linked.");
		console.log(chalk.gray("Use the --force if you must"));
	}
}