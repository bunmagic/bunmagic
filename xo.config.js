export default {
	extends: [
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		// Allow importing files without extensions
		'import/extensions': 0,
		// There's a lot of async loops here - allow await in loops.
		'no-await-in-loop': 0,
		'@typescript-eslint/no-require-imports': 0,
		// Allow exporting anonymous functions
		'import/no-anonymous-default-export': 0,
		// I'm not sure I agree that everything should be a nullish coalescing operator
		'@typescript-eslint/prefer-nullish-coalescing': 0,
		'@typescript-eslint/array-type': 0,
		// Allow UPPER_CASE_CONSTANTS
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variable',
				format: [
					'camelCase',
					'UPPER_CASE',
				],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow',
			},
			{
				selector: 'variable',
				types: [
					'boolean',
				],
				format: [
					'camelCase',
				],
			},
			{
				selector: 'typeLike',
				format: [
					'PascalCase',
				],
			},
		],
		// It's a CLI application, `bin` is a common abbreviation for `binary`
		'unicorn/prevent-abbreviations': [
			'error',
			{
				allowList: {
					bin: true,
				},
			},
		],
		// `prompt` and `confirm` are useful for CLI applications
		'no-alert': 0,
		// Allow `process.exit()`
		'n/prefer-global/process': 0,
		// Adding multiple lines can be useful for readability
		'no-multiple-empty-lines': 0,
		// iLL wRite MY Comments aS I daM PLEase, TYVM.
		'capitalized-comments': 0,
	},
};
