#!/usr/bin/env node
/**
 * Gate de design do repositório — roda no `pnpm lint` da raiz.
 * Checagens: emoji, copy proibida, ícones fora de Phosphor (erros)
 * e uso de text-lime sem fundo escuro no mesmo arquivo (aviso).
 * Regras: scripts/design-rules.mjs · Documento: design.md
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";
import {
  bannedCopy,
  bannedCopyMessage,
  bannedIconPackages,
  bannedIconMessage,
  emojiMessage,
  emojiRegex,
} from "./design-rules.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["apps/web/src", "apps/mockup/src", "packages"];
const EXT = /\.(ts|tsx)$/;
const SKIP = /(node_modules|\.next|dist)/;

const DARK_BG = /\bbg-(jungle|gunmetal|pine)\b/;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (SKIP.test(path)) continue;
    const stat = statSync(path);
    if (stat.isDirectory()) yield* walk(path);
    else if (EXT.test(entry)) yield path;
  }
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text[i] === "\n") line++;
  return line;
}

const errors = [];
const warnings = [];

for (const dir of SCAN_DIRS) {
  let files;
  try {
    files = [...walk(join(ROOT, dir))];
  } catch {
    continue;
  }

  for (const file of files) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, "utf8");

    for (const match of text.matchAll(emojiRegex)) {
      errors.push(`${rel}:${lineOf(text, match.index)}: ${emojiMessage}`);
    }

    const lower = text.toLowerCase();
    for (const phrase of bannedCopy) {
      const at = lower.indexOf(phrase);
      if (at !== -1) {
        errors.push(`${rel}:${lineOf(text, at)}: copy proibida "${phrase}" — ${bannedCopyMessage}`);
      }
    }

    for (const match of text.matchAll(/from\s+["']([^"']+)["']/g)) {
      const source = match[1];
      const hit = bannedIconPackages.find(
        (pkg) => source === pkg || source.startsWith(`${pkg}/`),
      );
      if (hit) {
        errors.push(`${rel}:${lineOf(text, match.index)}: import de "${source}" — ${bannedIconMessage}`);
      }
    }

    if (text.includes("text-lime") && !DARK_BG.test(text)) {
      const at = text.indexOf("text-lime");
      warnings.push(
        `${rel}:${lineOf(text, at)}: text-lime sem fundo escuro (bg-jungle/bg-gunmetal/bg-pine) neste arquivo — Lime em fundo claro não tem contraste (design.md §2).`,
      );
    }
  }
}

for (const warning of warnings) console.warn(`AVISO  ${warning}`);
for (const error of errors) console.error(`ERRO   ${error}`);

if (errors.length > 0) {
  console.error(`\ndesign-check: ${errors.length} erro(s), ${warnings.length} aviso(s).`);
  process.exit(1);
}
console.log(`design-check: ok (${warnings.length} aviso(s)).`);
