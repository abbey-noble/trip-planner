import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'

/**
 * Deliberately narrow. The point is to catch references to things that do not
 * exist — the class of mistake the bundler happily compiles and that only
 * shows up as a blank screen at runtime.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/sw.js'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      // Without this, every component looks unused because JSX is not tracked.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^(React|_)',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
]
