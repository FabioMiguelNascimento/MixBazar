import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import {
  bannedCopy,
  bannedCopyMessage,
  bannedIconPackages,
  bannedIconMessage,
} from "../../scripts/design-rules.mjs";

const designRules = {
  "no-restricted-imports": [
    "error",
    {
      paths: bannedIconPackages.map((name) => ({
        name,
        message: bannedIconMessage,
      })),
    },
  ],
  "no-restricted-syntax": [
    "error",
    ...bannedCopy.flatMap((phrase) => {
      const selector = `[value=/${phrase.replace(/[/\\]/g, "\\/")}/i]`;
      return [
        { selector: `Literal${selector}`, message: bannedCopyMessage },
        { selector: `JSXText${selector}`, message: bannedCopyMessage },
      ];
    }),
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: designRules,
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
