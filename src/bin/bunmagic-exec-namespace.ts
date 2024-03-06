#!/usr/bin/env bun
import { runNamespace } from 'bunmagic/run';

const sourcePath = args.shift();
const namespace = args.shift();

if (!sourcePath) {
	throw new Error('Missing source path.');
}

if (!namespace) {
	throw new Error('Missing script namespace.');
}

await runNamespace(namespace, sourcePath);
