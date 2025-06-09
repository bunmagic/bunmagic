#!/usr/bin/env bun --install=fallback
import 'bunmagic/globals';
import { runNamespace } from 'bunmagic/run';

const sourcePath = args.shift();
const namespace = args.shift();

if (!sourcePath) {
	throw new Exit('Missing source path.');
}

if (!namespace) {
	throw new Exit('Missing script namespace.');
}

await runNamespace(namespace, sourcePath);
