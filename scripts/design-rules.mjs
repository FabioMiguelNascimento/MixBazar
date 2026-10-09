/**
 * Regras de design compartilhadas — fonte única de verdade.
 * Usadas pelo ESLint (apps/web, apps/mockup) e pelo gate scripts/design-check.mjs.
 * Documento por trás das regras: design.md (raiz do repositório).
 */

export const bannedCopy = [
  "comprar agora",
  "finalizar compra",
  "finalizar pedido",
  "finalizar carrinho",
  "carrinho de compras",
  "checkout",
];

export const bannedCopyMessage =
  "Mix Bazar não tem checkout: use 'Adicionar à cesta' e 'Enviar solicitação'. Ver design.md §1/§12.";

export const bannedIconPackages = [
  "lucide-react",
  "react-icons",
  "@heroicons/react",
  "@heroicons/react/24",
  "@radix-ui/react-icons",
  "@mui/icons-material",
];

export const bannedIconMessage =
  "Ícones são exclusivamente @phosphor-icons/react. Ver design.md §8.";

/** Emoji e pictográficos (proibidos no código, markup e textos da UI). */
export const emojiRegex =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu;

export const emojiMessage =
  "Emoji proibido na UI: use ícone Phosphor. Ver design.md §8/§12.";
