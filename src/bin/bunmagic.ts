#!/usr/bin/env bun
import {runNamespace} from 'bunmagic/run';

const sourcePath = path.resolve(import.meta.dir, '..', 'scripts');
await runNamespace('bunmagic', sourcePath);
