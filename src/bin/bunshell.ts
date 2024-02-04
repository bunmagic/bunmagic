#!/usr/bin/env bun
import { runNamespace } from "bunshell/run";
const sourcePath = path.resolve(import.meta.dir, "..", "scripts");
await runNamespace("bunshell", sourcePath);