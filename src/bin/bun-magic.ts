#!/usr/bin/env bun
import {runNamespace} from 'bun-magic/run';

const sourcePath = path.resolve(import.meta.dir, '..', 'scripts');
await runNamespace('bun-magic', sourcePath);
