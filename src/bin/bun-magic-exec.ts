#!/usr/bin/env bun
import {run} from 'bun-magic/run';

const scriptFile = argv._.shift();
argv._.shift(); // Remove the script name.

if (!scriptFile) {
	throw new Error('No script specified.');
}

await run(scriptFile);
