import { relinkBins } from "../bins";

export const info = {
	desc: "Ensure all your script files have an executable in the bin directory.",
	usage: `bunshell link [--force]`,
};


export async function run() {
	if (await relinkBins()) {
		console.log("\nDone!");
	} else {
		console.log("All executables are already linked.");
		console.log(chalk.gray("Use the --force if you must"));
	}
}