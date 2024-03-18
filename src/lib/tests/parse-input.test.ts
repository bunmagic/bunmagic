import '../../globals'; // eslint-disable-line import/no-unassigned-import
import { expect, test } from 'bun:test';
import { parseInput } from '../parse-input';


test('parse input with single word', () => {
	expect(parseInput('foo')).toEqual({ slug: 'foo', command: 'foo' });
});

test('parse input with space-separated namespace and slug', () => {
	expect(parseInput('foo bar')).toEqual({ namespace: 'foo', slug: 'bar', command: 'foo bar' });
});

test('parse input with slash-separated namespace and slug', () => {
	expect(parseInput('foo/bar')).toEqual({ namespace: 'foo', slug: 'bar', command: 'foo bar' });
});

test('parse input with single word and extension', () => {
	expect(parseInput('foo.ts')).toEqual({ slug: 'foo', extension: 'ts', command: 'foo' });
});

test('parse input with space-separated namespace, slug, and extension', () => {
	expect(parseInput('foo bar.ts')).toEqual({
		namespace: 'foo', slug: 'bar', extension: 'ts', command: 'foo bar',
	});
});

test('error with empty string', () => {
	expect(() => parseInput('')).toThrow(Error);
});

test('error with space', () => {
	expect(() => parseInput(' ')).toThrow(Error);
});

test('error with too many space-separated values', () => {
	expect(() => parseInput('foo bar baz')).toThrow(Error);
});

test('error with too many slash-separated values', () => {
	expect(() => parseInput('foo/bar/baz')).toThrow(Error);
});

test('ignore trailing dot', () => {
	expect(parseInput('foo.')).toEqual({
		slug: 'foo', command: 'foo',
	});
});

test('ignore only extension', () => {
	expect(parseInput('.ts')).toEqual({
		slug: 'ts',
		command: 'ts',
	});
});

test('ignore double dots', () => {
	expect(parseInput('foo..ts')).toEqual({
		slug: 'foo', extension: 'ts', command: 'foo',
	});
});

test('allow 2 or more dots', () => {
	expect(parseInput('foo.bar.ts')).toEqual({
		slug: 'foo.bar', extension: 'ts', command: 'foo.bar',
	});
	expect(parseInput('foo.bar.baz.ts')).toEqual({
		slug: 'foo.bar.baz', extension: 'ts', command: 'foo.bar.baz',
	});
	expect(parseInput('ns/bar.baz.qux.ts')).toEqual({
		namespace: 'ns', slug: 'bar.baz.qux', extension: 'ts', command: 'ns bar.baz.qux',
	});
});


test('normalize invalid path characters', () => {
	expect(parseInput('foo\\..\\bar')).toEqual({
		slug: 'foo', extension: 'bar', command: 'foo',
	});
	expect(parseInput('foo\\bar')).toEqual({
		slug: 'foobar', command: 'foobar',
	});
	expect(() => parseInput('../foo/bar')).toThrow(Error);
	expect(() => parseInput('foo/../bar')).toThrow(Error);
	expect(() => parseInput('foo/./bar')).toThrow(Error);
	expect(() => parseInput('..')).toThrow(Error);
	expect(() => parseInput('.')).toThrow(Error);
});

test('normalize leading or trailing slashes', () => {
	expect(parseInput('/foo/bar')).toEqual({
		namespace: 'foo', slug: 'bar', command: 'foo bar',
	});
	expect(parseInput('foo/bar/')).toEqual({
		namespace: 'foo', slug: 'bar', command: 'foo bar',
	});
	expect(parseInput('\\foo\\bar')).toEqual({
		slug: 'foobar', command: 'foobar',
	});
	expect(parseInput('foo\\bar\\')).toEqual({
		slug: 'foobar', command: 'foobar',
	});
});
