// Importing each module
import { $ } from "bun";
import chalk from 'chalk';
import fs from 'fs-extra';
import { globby } from 'globby';
import os from 'node:os';
import path from 'path';
import which from 'which';
import minimist from 'minimist';


const argv = minimist(process.argv.slice(2) || [])

// Exporting all imported modules
export default {
	$,
	chalk,
	fs,
	globby,
	os,
	path,
	which,
	argv,
};
