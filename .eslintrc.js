module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
    'simple-import-sort',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        ignoredNodes: [
          'ConditionalExpression',
        ],
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': [
      'error',
    ],
    '@typescript-eslint/no-underscore-dangle': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
    ],
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'default-param-last': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    indent: [
      'error',
      2,
      {
        ignoredNodes: [
          'ConditionalExpression',
        ],
        SwitchCase: 1,
      },
    ],
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'max-len': [
      'warn',
      {
        code: 200,
      },
    ],
    'no-bitwise': 'off',
    'no-console': 'off',
    'no-dupe-class-members': 'off',
    'no-extra-semi': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
      },
    ],
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'error',
    'no-use-before-define': 'off',
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: {
          consistent: true,
          minProperties: 4,
          multiline: true,
        },
        ImportDeclaration: {
          consistent: true,
          minProperties: 4,
          multiline: true,
        },
        ObjectExpression: {
          consistent: true,
          minProperties: 4,
          multiline: true,
        },
        ObjectPattern: {
          consistent: true,
          minProperties: 4,
          multiline: true,
        },
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    ],
    'react/jsx-indent': [
      'error',
      2,
    ],
    'react/jsx-indent-props': [
      'error',
      2,
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'off',
    'react/no-unstable-nested-components': [
      'error',
      {
        allowAsProps: true,
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/state-in-constructor': 'off',
    semi: [
      'error',
      'always',
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            '^\\u0000',
          ],
          [
            '^react$',
          ],
          [
            '^@?\\w',
          ],
          [
            '^@?\\w',
          ],
          [
            '^[^.]',
          ],
          [
            '^\\.',
          ],
          [
            '^.+\\.s?css$',
          ],
        ],
      },
    ],
    'sort-imports': 'off',
    'sort-vars': [
      'error',
    ],
    yoda: 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
