import next from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['**/node_modules/**', '.next/**', 'out/**', 'lib/supabase/types.ts'] },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
];
