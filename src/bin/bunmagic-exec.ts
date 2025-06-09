#!/usr/bin/env bun --install=fallback
import 'bunmagic/globals';
import { run } from 'bunmagic/run';

const scriptFile = args.shift();
args.shift(); // Remove the script name.

if (!scriptFile) {
	throw new Exit('No script specified.');
}

await run(scriptFile);
