// One ESLint flat config for the whole repo (#416).
import js from '@eslint/js';
import globals from 'globals';

const style = {
  indent: ['error', 2, { SwitchCase: 1 }],
  'linebreak-style': ['error', 'unix'],
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
};

export default [
  { ignores: ['node_modules/**', 'dist/**', 'prototype-rule-format/**'] },
  js.configs.recommended,
  { rules: style },

  // The current, hand-written extension (removed in #425).
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.greasemonkey,
      },
    },
    rules: { 'max-len': ['warn', { code: 80 }] },
  },

  // The build and its tests run in Node.
  {
    files: ['build/**/*.js', 'test/**/*.js', '*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },

  // Rules are modules whose page code runs in the browser. Lint can't see a
  // function using a module variable here; the build's output lint does.
  // Tests hold sample Rules, so they see the same globals.
  {
    files: ['rules/**/*.js', 'test/**/*.js', 'build/runtime.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, ...globals.greasemonkey, ...globals.jquery,
        ...globals.webextensions,
      },
    },
  },

  // The Firefox background's engine, copied into background.js (#417).
  {
    files: ['build/firefox-runtime.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.webextensions } },
  },
];
