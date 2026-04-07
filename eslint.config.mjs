import fecConfig from '@redhat-cloud-services/eslint-config-redhat-cloud-services';
import jestDom from 'eslint-plugin-jest-dom';
import jsdoc from 'eslint-plugin-jsdoc';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';

/*
  To debug eslint config run: npx eslint --inspect-config
*/

const TEST_FILES = [
  'src/**/*.test.{js,jsx}',
  'src/**/__tests__/**/*.{js,jsx}',
];

export default defineConfig([
  globalIgnores(['node_modules/*', 'static/*', 'dist/*']),
  ...fecConfig,
  jsdoc.configs['flat/recommended'],
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // Disable JSDoc's type requirements for JavaScript
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-property-type': 'off',
      'jsdoc/require-type': 'off',
    },
  },
  {
    files: TEST_FILES,
    ...jestDom.configs['flat/recommended'],
  },
  {
    files: TEST_FILES,
    ...testingLibrary.configs['flat/react'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    ...reactHooks.configs['recommended-latest'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    rules: {
      'no-debugger': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'rulesdir/disallow-fec-relative-imports': 'off',
      'rulesdir/forbid-pf-relative-imports': 'off',
      'jsdoc/tag-lines': 0,
      'jsdoc/require-jsdoc': 0,
      'jsdoc/check-line-alignment': [
        'error',
        'always',
        {
          customSpacings: {
            postDelimiter: 2,
          },
        },
      ],
    },
  },
]);
