import { expect, test } from 'bun:test';
import { insertCommentLine } from './insert-comment';


test('insert a comment line', async () => {
	const content = `/**
 * Description
 * @name name
 **/`;

	const line = '@url example.com';
	const result = `/**
 * Description
 * @name  name
 * @url   example.com
 */`;

	expect(await insertCommentLine(content, '@url example.com')).toEqual(result);
});


test('rewrite a single comment line', async () => {
	const content = `/** @name name */`;
	const result = `/**
 * @name  name
 * @url   example.com
 */`;
	expect(await insertCommentLine(content, '@url example.com')).toEqual(result);
});


test('rewrite a single comment line with two trailing stars', async () => {
	const content = `/** @name name **/`;
	const result = `/**
 * @name  name
 * @url   example.com
 */`;
	expect(await insertCommentLine(content, '@url example.com')).toEqual(result);
});

test('insert a comment in a multi-line comment', async () => {
	const content = `/**
 * Description
 * @name name
 * @details Some detailed description here
 **/`;

	const result = `/**
 * Description
 * @name        name
 * @details     Some       detailed description here
 * @additional  Additional info
 */`;

	expect(await insertCommentLine(content, '@additional Additional info')).toEqual(result);
});


test('insert a plain description without any @ symbols', async () => {
	const content = `/** Description only **/`;
	const result = `/**
 * Description only
 * Plain description addition
 */`;
	expect(await insertCommentLine(content, 'Plain description addition')).toEqual(result);
});


