import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        IntersectionObserver: 'readonly',
        AbortController: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Hooks correctness — the most important rule for React apps
      ...reactHooks.configs.recommended.rules,

      // Warns if a file mixes component and non-component exports (breaks HMR)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // General quality
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console':     ['warn', { allow: ['warn', 'error'] }],
      'prefer-const':   'error',
      'no-var':         'error',
    },
  },

  // Disable all formatting rules — Prettier handles those
  prettierConfig,

  { ignores: ['dist/', 'node_modules/'] },
];
