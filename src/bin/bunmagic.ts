#!/usr/bin/env bun
import 'bunmagic/globals';
import { migrateLegacyWrappers } from '@lib/migrate-wrappers';
import { runNamespace } from 'bunmagic/run';

const sourcePath = path.resolve(import.meta.dir, '..', 'scripts');
await migrateLegacyWrappers();
await runNamespace('bunmagic', sourcePath);
