import { create } from '../src/scripts/create';

const url = args[0];
console.log(`Fetching: ${url}`);
const response = await fetch(url);

if (!response.ok) {
	throw new Error(`Failed to fetch: ${url}: ${response.status} (${response.statusText})`);
}

const contents = await response.text();
console.log('Received:', contents.length, 'bytes:');
console.log(ansis.dim('\n```\n'));
console.log(ansis.gray(contents));
console.log(ansis.dim('\n```\n'));

if (!(ack('Create new script from this content?'))) {
	throw new Exit('Aborted');
}

const filename = url.split('/').pop() || 'untitled.ts';
await create(filename, contents);

// console.log(ansis.dim(`What would you like to call this script? (default: ${defaultSlug})`));
// const slug = prompt('Script Name:', defaultSlug);

// if (!slug) {
// 	throw new Error('No script name provided');
// }

// const scriptName = `${slug}.${extension}`;
// const target = path.join(directory, scriptName);

// console.log(`Creating a new script: ${scriptName}`);
// await Bun.file(target).write(contents);
// console.log(ansis.green('Done!'));
