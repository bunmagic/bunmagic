import {
	addSourceDirectory
} from "../sources";
import { relinkBins } from "../bins";

export const info = {
	desc: `Add an additional directory to use as script source.`,
	usage: `bunshell add_source`
}

export async function run() {
	const sourceDir = argv._[0];
	if (sourceDir && !fs.pathExistsSync(sourceDir)) {
		console.log(
			`The path you provided doesn't exist. Are you sure it's correct?`,
		);
		console.log(path.resolve(sourceDir));
		if (!(ack("\nContinue?"))) {
			return;
		}
	}
	await addSourceDirectory(sourceDir);

	// After a new directory is added, it might need to relink
	await relinkBins();
}