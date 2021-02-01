module.exports = {
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:import/typescript',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],
    rules: {
        'max-len': ['warn', { code: 100 }],
        'no-empty': 'warn',
        'no-empty-function': [
            'error',
            {
                allow: ['asyncMethods', 'asyncFunctions', 'methods', 'constructors'],
            },
        ],
        'import/prefer-default-export': 'off',
        'no-useless-constructor': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                ts: 'never',
            },
        ],
        'no-underscore-dangle': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
    },
};
