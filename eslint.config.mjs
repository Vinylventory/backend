import typescriptEslint from "@typescript-eslint/eslint-plugin";
import * as graphql from "@graphql-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        ".prettierrc.mjs",
        "eslint.config.mjs",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "@graphql-eslint": {rules: graphql.rules},
    },

    languageOptions: {
        globals: {},
        parser: tsParser,
        ecmaVersion: 2024,
        sourceType: "script",

        parserOptions: {
            project: ["./tsconfig.json"],
        },
    },

    rules: {
        "no-console": "off",
        "no-debugger": "off",

        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],
    },
}, {
    files: ["**/*.graphql"],
    languageOptions: {
        parser: graphql.parser,
    },
    plugins: {
        "@graphql-eslint": {rules: graphql.rules},
    },
    rules: {
        "@graphql-eslint/no-anonymous-operations": "error",
        "@graphql-eslint/no-duplicate-fields": "error",
    },
}];