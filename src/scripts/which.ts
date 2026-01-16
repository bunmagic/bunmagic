/**
 * Show the source location for a script or namespace.
 * @usage <script-name>
 */
import { Script } from '@lib/script';
import { findAny } from '@lib/sources';

export default async function () {
	if (args.length === 0) {
		throw new Error('You must specify a script name.');
	}

	const input = args.join(' ');
	const result = await findAny(input);

	if (!result) {
		throw new Exit(`Can't find script or namespace "${input}"`);
	}

	if (result instanceof Script) {
		console.log(result.source);
		return;
	}

	if (result.namespace) {
		console.log(result.dir);
		return;
	}

	throw new Exit('Unknown result type');
}
