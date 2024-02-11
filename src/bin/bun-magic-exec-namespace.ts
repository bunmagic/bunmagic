#!/usr/bin/env bun
import {runNamespace} from 'bun-magic/run';

const sourcePath = argv._.shift();
const namespace = argv._.shift();

if (!sourcePath) {
	throw new Error('Missing source path.');
}

if (!namespace) {
	throw new Error('Missing script namespace.');
}

await runNamespace(namespace, sourcePath);
