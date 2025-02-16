import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{ts,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'no-empty-pattern': 'off',
    'no-empty': 'off',
    "no-unused-vars": 'off',
    "@typescript-eslint/no-unused-vars": 'off',
  }, settings: {
      react: {
        version: 'detect',
      }
    }
  },
  eslintPluginPrettierRecommended
];