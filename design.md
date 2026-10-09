# Design — Mix Bazar

Guia de características e padrões de design do Mix Bazar. Este documento descreve a linguagem visual que a Home (`apps/mockup/src/app/home/page.tsx`) já define e que as próximas telas (Catálogo, Detalhes do produto, Montar cesta, Solicitações e painel administrativo) devem reutilizar.

Fonte de verdade dos tokens: `packages/ui/src/theme.css`. Se mudar um valor aqui, mude primeiro lá.

---

## 1. Identidade

- **Personalidade:** bazar de bairro — próximo, artesanal e prático. Verde vivo com calor humano, não tech retail.
- **Promessa central:** *Monte sua cesta do seu jeito* — a plataforma organiza pedidos por solicitação, não por checkout. Toda a linguagem reforça "solicitação" e "atendimento", nunca "compra/finalizar".
- **Tom de voz:** direto, caloroso, sem jargão de e-commerce genérico. Frases curtas em pt-BR. Nunca "elevate", "seamless" nem similares.

## 2. Paleta

Cinco cores de marca + neutros semânticos. Valores exatos em `theme.css` (oklch).

| Cor | Papel | Onde usar |
|---|---|---|
| **Jungle** | Ação principal | Botões primários, links ativos, ícones de marca, eyebrow em fundo claro, anel de foco |
| **Lime** | Destaque e promo | Badges `20% OFF`, contadores (cesta/favoritos), números dos passos, ponto de navegação do hero, botão em fundo escuro, labels sobre imagem |
| **Pine** | Texto secundário | Descrições, categorias, ícones neutros, barra de serviço no topo |
| **Platinum** | Superfície | Fundo da página, chips claros, texto sobre fundo escuro |
| **Gunmetal** | Texto principal | Títulos, preços, corpo em fundo claro; também superfície escura (`Monte uma cesta`, hero) |

### Regras de uso

1. **Jungle = ação.** Em cada tela existe exatamente um botão primário Jungle. Se houver dois, o secundário vira outline ou Lime.
2. **Lime = destaque, com parcimônia.** Promocionais, indicadores e botões *sobre fundo escuro* (Lime sobre Gunmetal/Jungle tem contraste alto; Lime como texto em fundo claro é proibido).
3. **Nunca texto Lime em fundo claro.** Para eyebrow em fundo claro use `text-jungle`; em fundo escuro use `text-lime`.
4. **Preço nunca só em Lime.** Preço é `font-heading text-gunmetal`; preço antigo é `text-muted-foreground line-through` ao lado.
5. **Cores semânticas** (`success`, `info`, `warning`, `danger`) são reservadas a feedback de sistema — não decoram a interface.

## 3. Tipografia

- **Família:** Montserrat (`--font-sans`, também via `font-heading`) para tudo da UI; Geist Mono para código/valores técnicos.
- **Escala prática** (a partir dos padrões da Home):

| Elemento | Classes | Observações |
|---|---|---|
| H1 do hero | `font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.03em] lg:text-[2.75rem]` | Só existe um por página |
| H2 de seção | `font-heading text-3xl font-semibold tracking-tight md:text-4xl` | |
| H3 de card/detalhe | `font-heading text-base..text-2xl font-semibold tracking-tight` | |
| Eyebrow | `text-xs font-semibold uppercase tracking-[0.16em]` | Jungle em claro, Lime em escuro |
| Corpo | `text-sm..text-base leading-6..leading-7` | `max-w-2xl` em descrições de seção |
| Micro | `text-xs font-medium` | Categoria do produto, badges, rodapé |

- **Nunca** itálico decorativo, fonte serifada ou peso acima de semibold nos títulos.
- Preços usam `font-heading` (semibold) mesmo em corpo pequeno — preço é elemento de hierarquia.

## 4. Layout e espaçamento

- **Container padrão:** `mx-auto max-w-7xl px-6`. Todas as seções da página compartilham a mesma margem — o hero alinha o conteúdo a esse container mesmo com a imagem vazando até a borda.
- **Ritmo vertical:** seções com `py-20 md:py-24` (ou `pb-20 md:pb-24` quando há próxima seção). Gap interno entre header da seção e conteúdo: `mt-10`.
- **Escalas semânticas** disponíveis: spacing `2xs…3xl` e containers `max-w-*`. Como o Tailwind v4 resolve `max-w-*` contra `--spacing` antes de `--container`, os containers `--max-width-*` do tema são obrigatórios — não remova.
- **Grids recorrentes:**
  - Categorias: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4`
  - Produtos: `grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12`
  - Blocos split: `lg:grid-cols-2` ou assimétricos `md:grid-cols-[1.35fr_0.65fr]`
- **Mobile:** tudo cai para coluna única abaixo de `md`; nada de layout assimétrico sem fallback `w-full`.

## 5. Raios

| Token | Valor | Uso |
|---|---|---|
| `rounded-button` | 9999px (pill) | Todo botão, badge e chip |
| `rounded-card` | 0.625rem | Cards, banners, painéis |
| `rounded-input` | 0.5rem | Inputs, campos de busca |
| `rounded-dialog` | 0.75rem | Modais (futuro) |

Pill nos botões é marca — não misture cantos arredondados pequenos em ações primárias.

## 6. Componentes e padrões da Home

Estes são os padrões a replicar nas próximas telas.

### ServiceBar
Faixa `bg-pine` com texto `text-platinum text-xs` no topo da página. Uma linha só, sempre sobre o header.

### Header
`sticky top-0 z-30`, altura fixa `h-[72px]`, `bg-background/95 backdrop-blur` com borda inferior. Ordem: logo → nav (`text-sm font-medium`, hover `text-jungle`) → busca (`rounded-input`) → ações (favoritos, cesta). Ações são botões redondos com `aria-label`; contador Lime com `text-gunmetal`.

### Hero de campanha
- Split 50/50: conteúdo à esquerda sobre `bg-jungle`, imagem `object-cover` sangrando até a borda direita; no mobile a imagem vira faixa de `h-56` no topo.
- Título `text-white`, descrição `text-white/80`, CTAs: primário **Lime** `text-gunmetal` + secundário outline `border-white/30`.
- Carousel com dots (`w-1.5 h-1.5`; ativo `w-8 bg-lime`), dados no array `heroCampaigns` — conteúdo de campanha é trocável sem tocar no layout.
- Troca de imagem com `animate-in fade-in duration-500`.

### SectionHeader
Componente único para abertura de seção: eyebrow opcional + `h2` + descrição (`max-w-2xl`) + ação opcional à direita (`text-jungle` com `ArrowRight`). Em `md+` o título e a ação ficam na mesma linha (`items-end justify-between`).

### Card de categoria
Sem caixa: `relative aspect-[4/5]` com imagem cobrindo, gradiente `from-gunmetal/75 via-gunmetal/5 to-transparent` para legibilidade e nome no canto inferior esquerdo. Hover: `scale-105` em `duration-700`.

### ProductCard
- **Sem moldura aparente** — a imagem é o card: `aspect-[4/4.5]`, `rounded-card`, fundo de reserva `bg-platinum`.
- Hover revela ações: badge promo Lime fixo no canto superior esquerdo; coração `bg-platinum/90` superior direito; `+` Jungle `bg-jungle` inferior direito — os dois últimos `opacity-0 group-hover:opacity-100 focus-visible:opacity-100`.
- Abaixo: categoria (`text-pine/70`) → nome (`font-heading font-semibold text-gunmetal`) → preço com antigo riscado.
- Não coloque botão permanente grande na grade. `+` ou "adicionar" só no hover.

### Padrão "diferencial" (Monte uma cesta)
Painel `rounded-card bg-gunmetal` split imagem/conteúdo, eyebrow Lime, lista numerada com bolinhas Lime, CTA Lime. Repetir exatamente este padrão em qualquer bloco institucional de destaque.

### Banner de campanha
`rounded-card bg-platinum` — eyebrow Jungle + `h2` + apoio `text-pine` + CTA Jungle à direita em `md:[1fr_auto]`.

### Cards com texto sobre imagem
Sempre gradiente `bg-gradient-to-t from-gunmetal/80 via-gunmetal/10 to-transparent` + eyebrow Lime + título Platinum + link com seta. Texto branco direto sobre foto sem gradiente é proibido.

### Footer
`bg-card` com borda superior; grid `md:[1.5fr_1fr_1fr]`; colunas com eyebrow (`text-pine uppercase`), links `text-pine/70` hover `text-jungle`; copyright `text-pine/50` separado por `border-t`.

## 7. Botões

| Variante | Classes base | Uso |
|---|---|---|
| Primário (claro) | `rounded-button bg-jungle text-platinum hover:bg-primary-hover active:bg-primary-active` | Ação principal da tela |
| Primário (escuro) | `rounded-button bg-lime text-gunmetal hover:bg-secondary-hover active:bg-secondary-active` | Sobre Gunmetal/Jungle/hero |
| Outline claro | `rounded-button border border-border bg-background text-gunmetal hover:bg-muted` | Alternativa ao primário |
| Outline escuro | `rounded-button border border-white/30 text-white hover:bg-white/10` | No hero |
| Texto/ação | `inline-flex items-center gap-2 text-jungle hover:text-pine` | "Ver catálogo", links com seta |

- Sempre `type="button"` explícito, `inline-flex items-center gap-2` quando tem ícone/seta.
- Estados: `transition` no padrão `hover → active → focus-visible`. Toda ação circular sem texto tem `aria-label`.

## 8. Ícones

- Biblioteca única: **Phosphor** (`@phosphor-icons/react`).
- Pesos: `regular` para UI geral, `duotone` para ilustração de categoria/produto, `fill` só para badges e favoritos ativos.
- Tamanhos padrão: 15–17px em texto de botão, 18–20px em ações de header/card, 28–56px em ilustração.
- Cor do ícone acompanha o texto do contexto (Pine neutro, Jungle ativo, Platinum sobre escuro).

## 9. Movimento

- Base: `transition` com `duration-700 ease-out` em imagens (`group-hover:scale-105`), `duration-200`/default em botões e cor de texto.
- Entrance: `animate-in fade-in duration-500` apenas para troca de campanha do hero.
- Nada de animação contínua, parallax ou spinner decorativo. `prefers-reduced-motion` deve desligar o `scale` de hover se algum dia virar requisito.

## 10. Imagens

- Fonte atual: Unsplash com `?auto=format&fit=crop&w=…&q=90` (mesma foto reaproveitada no hero, categoria e produto mantém consistência — se trocar, troque nos três).
- Toda foto com texto sobreposto passa pelo gradiente do padrão de cards com texto.
- `alt` descritivo em pt-BR; imagens puramente decorativas usam `alt=""`.
- Reserva de espaço sempre com `bg-platinum` (evita layout shift).

## 11. Acessibilidade

- `lang="pt-BR"` no documento; conteúdo em português semântico.
- Todo botão só-ícone tem `aria-label`; carousel expõe `aria-current`.
- Foco visível: anel padrão (`outline-ring/50` já global no tema) + `focus-visible:opacity-100` nos elementos que aparecem no hover.
- Contraste: texto principal Gunmetal sobre Platinum, Platinum sobre Jungle/Gunmetal — ambos acima de 4.5:1.

## 12. Do e Don't

**Faça:**
- Um botão primário Jungle por tela; Lime para destaque/promoção.
- Imagem protagonista e moldura leve (ou nenhuma) nos cards.
- Reusar `SectionHeader`, `ProductCard`, `rounded-*` e a escala `2xs…3xl` de `@repo/ui`.
- Copy de "solicitação/atendimento", não de checkout.

**Não faça:**
- Botão "Comprar agora"/"Finalizar compra" — o fluxo real é adicionar à cesta → enviar solicitação.
- Cards genéricos shadcn com borda e sombra pesada em cima de foto.
- Texto branco sem gradiente sobre imagem; texto Lime em fundo claro.
- Emojis no UI; ícone Phosphor sempre.
- Layout centralizado simétrico em tudo — o hero é split, os blocos são assimétricos.