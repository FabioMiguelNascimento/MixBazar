---
name: mix-design
description: 'Regras de design do Mix Bazar (paleta Jungle/Lime, ícones Phosphor, copy de solicitação, padrões de card/botão/seção). Use SEMPRE em trabalho de UI: criar ou editar telas, componentes, JSX/TSX, CSS/Tailwind, layout, Home, card, botão, banner, formulário, tabela, dashboard, ou revisar/aprovar código visual em apps/web ou apps/mockup.'
---

# Mix Bazar — regras de design

Antes de escrever ou aprovar qualquer UI neste repo, leia `design.md` na raiz.
Ele é a fonte da verdade; este skill é o resumo de execução.

## Checklist obrigatório

1. **Cores**
   - Um único botão primário Jungle por tela (`bg-jungle text-platinum hover:bg-primary-hover`).
   - Lime só para promo/badge/indicador/botão sobre fundo escuro. Nunca `text-lime` em fundo claro.
   - Texto sobre foto sempre com gradiente `bg-gradient-to-t from-gunmetal/80 via-gunmetal/10 to-transparent`.
2. **Tipografia**
   - Títulos: `font-heading` (Montserrat), `font-semibold`, `tracking-tight`. H1 único por página.
   - Eyebrow: `text-xs font-semibold uppercase tracking-[0.16em]` — Jungle em claro, Lime em escuro.
   - Preço: `font-heading text-gunmetal`; antigo com `text-muted-foreground line-through`.
3. **Componentes**
   - Container: `mx-auto max-w-7xl px-6`; seções `py-20 md:py-24`.
   - Raios: `rounded-button` (pill) em botões/chips, `rounded-card` em blocos, `rounded-input` em campos.
   - ProductCard sem moldura: imagem `aspect-[4/4.5]` protagonista; coração e `+` só no hover (`opacity-0 group-hover:opacity-100 focus-visible:opacity-100`).
   - Reusar `SectionHeader`, `ProductCard` e os padrões do design.md §6 em vez de inventar novo.
4. **Ícones e texto**
   - Somente `@phosphor-icons/react`. Nada de lucide, react-icons ou emoji.
   - Copy: "cesta", "solicitação", "atendimento". Proibido: comprar agora, finalizar compra/pedido, carrinho, checkout.
   - pt-BR, tom de bazar próximo. Botão só-ícone sempre com `aria-label`.

## Verificação

- `pnpm lint` na raiz roda ESLint + `scripts/design-check.mjs` (emoji, copy, ícones, `text-lime`).
- Erros do design-check quebram o lint — corrija, não contorne.
- Layout deve cair para coluna única abaixo de `md` (nada de assimétrico sem fallback).
