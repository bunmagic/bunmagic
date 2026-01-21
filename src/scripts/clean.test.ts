import { describe, expect, test } from 'bun:test';
import { Script } from '@lib/script';
import type { Source } from '@lib/sources';
import { getExpectedBins } from './clean';

describe('getExpectedBins', () => {
	test('includes namespace and global alias bins for namespaced sources', async () => {
		const script = new Script({
			source: '/tmp/foobar/b.ts',
			namespace: 'foobar',
			slug: 'b',
			globalAliases: ['bananas'],
		});
		const sources: Source[] = [
			{
				dir: '/tmp/foobar',
				namespace: 'foobar',
				scripts: [script],
			},
		];

		const expected = await getExpectedBins(sources);

		expect(expected.has('foobar')).toBe(true);
		expect(expected.has('bananas')).toBe(true);
	});
});
