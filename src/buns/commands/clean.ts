import {
	binfo
} from "../sources";
import { getBins } from "../bins";

export const info = {
	desc: "Remove bin files from the bin directory that don't have a matching script.",
	usage: `bunshell clean`,
};

export async function run() {
	console.log("Cleaning up the the bin directory.");

	const realBins = await getBins();
	const expectedBins = (await binfo()).map((info) => info.bin);

	for (const bin of realBins) {
		if (expectedBins.includes(bin)) {
			continue;
		}

		const name = path.basename(bin);
		if (ack(`Delete ${name}?`, "y")) {
			await $`rm ${bin}`;
		}
	}

	console.log("Bins directory is clean!");
}