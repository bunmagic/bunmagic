import { describe, expect, it } from 'bun:test';
import { $stdin } from './stdin';

describe('$stdin', () => {
	it('should be a function', () => {
		expect(typeof $stdin).toBe('function');
	});

	it('should return a Promise', () => {
		// Mock Bun.stdin.stream to avoid hanging in tests
		const originalStream = Bun.stdin.stream;
		Bun.stdin.stream = () => {
			return {
				async *[Symbol.asyncIterator]() {
					yield new TextEncoder().encode('test');
				},
			} as ReturnType<typeof Bun.stdin.stream>;
		};

		const result = $stdin();
		expect(result).toBeInstanceOf(Promise);

		// Restore original
		Bun.stdin.stream = originalStream;
	});

	it('should convert Buffer chunks to string', async () => {
		// Mock Bun.stdin.stream
		const originalStream = Bun.stdin.stream;
		const testData = 'Hello, World!';
		
		Bun.stdin.stream = () => {
			return {
				async *[Symbol.asyncIterator]() {
					yield new TextEncoder().encode(testData);
				},
			} as ReturnType<typeof Bun.stdin.stream>;
		};

		const result = await $stdin();
		expect(result).toBe(testData);

		// Restore original
		Bun.stdin.stream = originalStream;
	});

	it('should handle multiple chunks', async () => {
		// Mock Bun.stdin.stream
		const originalStream = Bun.stdin.stream;
		const chunks = ['Hello', ', ', 'World', '!'];
		
		Bun.stdin.stream = () => {
			return {
				async *[Symbol.asyncIterator]() {
					for (const chunk of chunks) {
						yield new TextEncoder().encode(chunk);
					}
				},
			} as ReturnType<typeof Bun.stdin.stream>;
		};

		const result = await $stdin();
		expect(result).toBe('Hello, World!');

		// Restore original
		Bun.stdin.stream = originalStream;
	});

	it('should handle empty input', async () => {
		// Mock Bun.stdin.stream
		const originalStream = Bun.stdin.stream;
		
		Bun.stdin.stream = () => {
			return {
				async *[Symbol.asyncIterator]() {
					// Don't yield anything
				},
			} as ReturnType<typeof Bun.stdin.stream>;
		};

		const result = await $stdin();
		expect(result).toBe('');

		// Restore original
		Bun.stdin.stream = originalStream;
	});

	it('should handle unicode characters', async () => {
		// Mock Bun.stdin.stream
		const originalStream = Bun.stdin.stream;
		const testData = '🚀 Unicode test: αβγ δεζ';
		
		Bun.stdin.stream = () => {
			return {
				async *[Symbol.asyncIterator]() {
					yield new TextEncoder().encode(testData);
				},
			} as ReturnType<typeof Bun.stdin.stream>;
		};

		const result = await $stdin();
		expect(result).toBe(testData);

		// Restore original
		Bun.stdin.stream = originalStream;
	});

	it('should handle newlines and special characters', async () => {
		// Mock Bun.stdin.stream
		const originalStream = Bun.stdin.stream;
		const testData = 'Line 1\nLine 2\r\nLine 3\tTabbed';
		
		Bun.stdin.stream = () => {
			return {
				async *[Symbol.asyncIterator]() {
					yield new TextEncoder().encode(testData);
				},
			} as ReturnType<typeof Bun.stdin.stream>;
		};

		const result = await $stdin();
		expect(result).toBe(testData);

		// Restore original
		Bun.stdin.stream = originalStream;
	});
});