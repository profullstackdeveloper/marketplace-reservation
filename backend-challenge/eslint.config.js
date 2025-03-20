"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_1 = __importDefault(require("@eslint/js"));
var typescript_eslint_1 = __importDefault(require("typescript-eslint"));
var eslint_plugin_js_1 = __importDefault(require("@stylistic/eslint-plugin-js"));
var eslint_plugin_ts_1 = __importDefault(require("@stylistic/eslint-plugin-ts"));
var eslint_plugin_n_1 = __importDefault(require("eslint-plugin-n"));
exports.default = typescript_eslint_1.default.config.apply(typescript_eslint_1.default, __spreadArray(__spreadArray(__spreadArray([js_1.default.configs.recommended,
    eslint_plugin_n_1.default.configs['flat/recommended-script']], typescript_eslint_1.default.configs.strictTypeChecked, false), typescript_eslint_1.default.configs.stylisticTypeChecked, false), [{
        ignores: [
            '**/node_modules/*',
            '**/*.mjs',
            '**/*.js',
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
    },
    {
        plugins: {
            '@stylistic/js': eslint_plugin_js_1.default,
            '@stylistic/ts': eslint_plugin_ts_1.default,
        },
    },
    {
        files: ['**/*.ts'],
    },
    {
        rules: {
            '@typescript-eslint/explicit-member-accessibility': 'warn',
            '@typescript-eslint/no-misused-promises': 0,
            '@typescript-eslint/no-floating-promises': 0,
            '@typescript-eslint/no-confusing-void-expression': 0,
            '@typescript-eslint/no-unnecessary-condition': 0,
            '@typescript-eslint/restrict-template-expressions': [
                'error', { allowNumber: true },
            ],
            '@typescript-eslint/restrict-plus-operands': [
                'warn', { allowNumberAndString: true },
            ],
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unsafe-enum-comparison': 0,
            '@typescript-eslint/no-unnecessary-type-parameters': 0,
            '@stylistic/js/no-extra-semi': 'warn',
            'max-len': [
                'warn',
                {
                    'code': 80,
                },
            ],
            '@stylistic/ts/semi': ['warn', 'always'],
            '@stylistic/ts/member-delimiter-style': ['warn', {
                    'multiline': {
                        'delimiter': 'comma',
                        'requireLast': true,
                    },
                    'singleline': {
                        'delimiter': 'comma',
                        'requireLast': false,
                    },
                    'overrides': {
                        'interface': {
                            'singleline': {
                                'delimiter': 'semi',
                                'requireLast': false,
                            },
                            'multiline': {
                                'delimiter': 'semi',
                                'requireLast': true,
                            },
                        },
                    },
                }],
            '@typescript-eslint/no-non-null-assertion': 0,
            '@typescript-eslint/no-unused-expressions': 'warn',
            'comma-dangle': ['warn', 'always-multiline'],
            'no-console': 1,
            'no-extra-boolean-cast': 0,
            'indent': ['warn', 2],
            'quotes': ['warn', 'single'],
            'n/no-process-env': 1,
            'n/no-missing-import': 0,
            'n/no-unpublished-import': 0,
            'prefer-const': 'warn',
        },
    }], false));
//# sourceMappingURL=eslint.config.js.map