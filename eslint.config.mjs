import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },

  {
    files: ["**/*.ts"],

    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],

    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
