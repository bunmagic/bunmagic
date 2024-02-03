#!/usr/bin/env bun
import {run} from "bunshell/run";

const scriptFile = argv._.shift();

if (!scriptFile) {
	throw new Error(`No script specified.`);
}
await run(scriptFile);
