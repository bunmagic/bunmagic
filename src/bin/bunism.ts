#!/usr/bin/env bun
import {runNamespace} from 'bunism/run';

const sourcePath = path.resolve(import.meta.dir, '..', 'scripts');
await runNamespace('bunism', sourcePath);
