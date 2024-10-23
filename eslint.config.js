import jsPlugin from "@eslint/js";
import tsPlugin from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const tsConfig = tsPlugin.config(
  jsPlugin.configs.recommended,
  ...tsPlugin.configs.recommended
);

export default [
  ...tsConfig,
  reactPlugin.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["eslint.config.js"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
