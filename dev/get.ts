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
