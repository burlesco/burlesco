// PROTOTYPE, throwaway. Same lint for every variant, so the comparison is fair.
import js from '@eslint/js';
import globals from 'globals';

const runtime = {
  ...globals.browser,
  ...globals.greasemonkey,
  ...globals.webextensions,
  ...globals.jquery,
};

export default [
  { ignores: ['node_modules/**', 'core/**', 'build.mjs', 'eslint.config.mjs'] },
  {
    ...js.configs.recommended,
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...runtime, ...globals.node } },
  },
  // Variant C code files are plain scripts, not modules.
  {
    files: ['variants/c-folders/**/page-*.js', 'variants/c-folders/**/isolated-*.js'],
    languageOptions: { sourceType: 'script', globals: runtime },
  },
  // Emitted scripts run in the browser only: no node globals, so a function
  // that closed over a module variable shows up as no-undef here.
  {
    files: ['dist/**/*.js'],
    languageOptions: { sourceType: 'script', globals: runtime },
    rules: { 'no-unused-vars': 'off' },
  },
];
