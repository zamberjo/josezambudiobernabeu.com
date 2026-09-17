import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		// Rune modules (*.svelte.ts) are plain TypeScript, not Svelte markup, so
		// they need the TS parser rather than the svelte one.
		files: ['**/*.svelte.ts'],
		languageOptions: {
			parser: tseslint.parser
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			// Static site: links are external or in-page fragments, so resolve() is not applicable.
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	prettier,
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
	}
];
