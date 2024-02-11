import {getSources} from '@lib/sources';
import {setupAlias} from '@lib/setup';
import {addSourceDirectory} from './link';
import {reloadBins} from './reload';

export const desc = 'Check if bun-magic is set up correctly';
export const usage = 'bun-magic doctor';

type CheckCallback = () => Promise<{
	level: Levels;
	followup?: () => Promise<unknown>;
}>;
type Levels = 'ok' | 'warning' | 'error' | 'fatal';

let issueCount = 0;
const followups: Array<() => Promise<unknown>> = [];

async function check(message: string, callback: CheckCallback) {
	const result = await callback();
	if (result.level === 'ok') {
		console.log(`✅ ${message}`);
	}

	if (result.level === 'error' || result.level === 'fatal') {
		issueCount++;
		console.log(`❌ ${message}`);
	}

	if (result.level === 'warning') {
		issueCount++;
		console.log(`⚠️ ${message}`);
	}

	if (result.level === 'fatal') {
		throw new Exit(`Abort. Cannot continue without fixing "${message}"`);
	}

	if (result.followup) {
		followups.push(result.followup);
	}
}

function response(status: Levels, followup?: () => Promise<unknown>) {
	return {level: status, followup};
}

export default async function setup() {
	const PATH = Bun.env.PATH;
	const BIN_PATH = `${$HOME}/.bun-magic/bin` as const;

	await check(
		'$PATH is set',
		async () => {
			if (!PATH) {
				console.log('Your $PATH is not set.');
				console.log('Please set your $PATH to include the bin directory.');
				console.log(BIN_PATH);
				return response('fatal');
			}

			return response('ok');
		},
	);

	await check(
		'Script sources are set up',
		async () => {
			const sources = await getSources();
			if (sources.length === 0) {
				console.log('Welcome! Where should bun-magic store your scripts?');
				await addSourceDirectory();
				await reloadBins();

				console.log('All done! If you want to add more source directories,');
				console.log(`run ${ansis.bold('bun-magic link')}`);
			}

			return response(sources.length > 0 ? 'ok' : 'warning');
		},
	);

	await check(
		'PATH is correctly set up',
		async () => {
			if (PATH && !PATH.includes(BIN_PATH)) {
				console.log('Make sure that you\'ve set up the $PATH correctly.');
				console.log(PATH);
				console.log(`Your $PATH should include ${BIN_PATH}`);
				return response('error');
			}

			return response('ok');
		},
	);

	await check(
		'Bun Magic is aliased to "bm"',
		async () => {
			const bm = await $`which bm`.quiet();
			if (bm.exitCode === 1) {
				return response('warning', async () => setupAlias(BIN_PATH));
			}

			const alreadyAliased = bm.exitCode === 0 && bm.stdout.toString().trim().startsWith(BIN_PATH);
			if (alreadyAliased) {
				return response('ok');
			}

			console.log(`bm is already aliased, but not to Bun Magic ${bm.stdout.toString().trim()}`);
			return response('error');
		},
	);

	if (issueCount === 0) {
		console.log('Your setup looks good!');
	} else {
		console.log(`Found ${issueCount} issue(s).`);
	}

	if (followups.length > 0) {
		console.log(`Attempting to fix ${followups.length} issue(s).`);
		for (const task of followups) {
			await task();
		}
	}
}
