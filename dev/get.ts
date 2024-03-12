import { parseInput } from '@lib/parse-input';
import { findAny } from '@lib/sources';
import { readFirstComment } from '@lib/parse-file-meta';
import { insertCommentLine } from '@lib/utils/insert-comment';
import { create } from '../src/scripts/create';

let url = new URL(args[0]);

if (url.host === 'github.com') {
	const rawUrlPath = url.pathname.replace(`/blob/`, '/');
	url = new URL(`https://raw.githubusercontent.com${rawUrlPath}`);
}

const response = await fetch(url);

if (!response.ok) {
	throw new Error(`Failed to fetch: ${url.toString()}: ${response.status} (${response.statusText})`);
}

const contentType = response.headers.get('Content-Type');
if (!contentType && !flags.force) {
	throw new Error(`The server did not provide a content type for: ${url.toString()}`);
}

if (contentType && !contentType.includes('text/plain') && !contentType.includes('application/javascript')) {
	throw new Error(`Unsupported content type: ${contentType}`);
}

const contents = await response.text();
console.log('Received:', contents.length, 'bytes:');

if (!(ack('Create new script from this content?'))) {
	throw new Exit('Aborted');
}

let filename = url.pathname.split('/').pop() || 'untitled.ts';
const { command, slug } = parseInput(filename);
const existing = await findAny(slug);
const commandName = ansis.bold(command);
if (existing) {
	const target = 'source' in existing ? existing.source : existing.dir;
	console.log(`"${commandName}" already exists: ${ansis.underline(target)}`);
	const newFilename = prompt('Enter a new name:');
	if (!newFilename) {
		throw new Exit('Aborted');
	}

	filename = newFilename;
}


const array = new Uint8Array(Buffer.from(contents));
const comment = readFirstComment(array);
const noCommentContent = contents.replace(comment, '');
const updatedComment = await insertCommentLine(comment, `@source ${url.toString()}`);
const content = updatedComment + noCommentContent;

console.log(ansis.gray(content));


await create(filename, content);
