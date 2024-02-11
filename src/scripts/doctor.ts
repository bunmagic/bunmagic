import {getSources} from '../lib/sources';
import {addSourceDirectory} from './link';
import {relinkBins} from './bins';

export const desc = 'Check if bunism is set up correctly';
export const usage = 'bunism doctor';

export default async function setup() {
	const PATH = Bun.env.PATH;
	const BIN_PATH = `${$HOME}/.bunism/bin`;

	let issues = 0;

	if (!PATH) {
		issues++;
		console.log('Your $PATH is not set.');
		console.log('Please set your $PATH to include the bin directory.');
		console.log(BIN_PATH);
	}

	const sources = await getSources();
	if (sources.length === 0) {
		console.log('Welcome! Where should bunism store your scripts?');
		await addSourceDirectory();
		await relinkBins();

		console.log('All done! If you want to add more source directories,');
		console.log(`run ${ansis.bold('bunism link')}`);
	}

	if (PATH && !PATH.includes(BIN_PATH)) {
		issues++;
		console.log('Make sure that you\'ve set up the $PATH correctly.');
		console.log(PATH);
		console.log(`Your $PATH should include ${BIN_PATH}`);
		return false;
	}

	if (issues === 0) {
		console.log('Your setup looks good!');
	} else {
		console.log(`Found ${issues} issue(s).`);
	}
}
