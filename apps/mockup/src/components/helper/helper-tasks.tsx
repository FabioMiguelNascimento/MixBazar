import type { Icon } from "@phosphor-icons/react";
import {
  ClipboardText,
  Heart,
  Images,
  Package,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Roteiros do assistente de demonstração.
 *
 * Cada passo aponta para um elemento da tela pelo atributo
 * `data-helper="..."` (seletor `[data-helper="id"]`). O alvo existe só
 * quando a página exige — o assistente espera por ele e usa "Próximo"
 * como reserva. Passos sem `target` são informativos, sem cursor.
 */
export type HelperStep = {
  /** Instrução curta exibida no card do passo. */
  text: string;
  /** Página onde vive o alvo — navega sozinha se o usuário estiver em outra. */
  href?: string;
  /** Seletor do elemento sinalizado pelo cursor. */
  target?: string;
  /**
   * Guia mostrado enquanto o alvo não aparece: para passos sem `href`,
   * o usuário costuma chegar ao alvo navegando por conta própria.
   */
  findingText?: string;
  /**
   * Formulário que a demonstração preenche antes de tocar o alvo —
   * só campos vazios: o que o usuário digitou fica em pé.
   */
  fill?: Array<{ selector: string; value: string }>;
  /**
   * Passo condicional: se não se aplicar (ex.: usuário já está com
   * sessão aberta), pula sozinho em vez de travar o passeio.
   */
  optional?: boolean;
  /**
   * Seletor que, já presente na página atual, prova que o passo não se
   * aplica e o dispensa na hora (sem ficar esperando o timeout).
   */
  skipWhen?: string;
};

export type HelperTask = {
  id: string;
  label: string;
  description: string;
  icon: Icon;
  steps: HelperStep[];
};

const SEL = (id: string) => `[data-helper="${id}"]`;

/* ------------------------------------------------------------------ */
/* Fluxos da loja                                                      */
/* ------------------------------------------------------------------ */

export const STORE_TASKS: HelperTask[] = [
  {
    id: "pedido",
    label: "Fazer um pedido",
    description: "Do catálogo até a confirmação pelo WhatsApp.",
    icon: ClipboardText,
    steps: [
      {
        text: "Vamos ao catálogo: abra um produto para ver os detalhes.",
        href: "/catalogo",
        target: SEL("produto-abrir"),
      },
      {
        text: "Gostou? Guarde no carrinho por aqui.",
        target: SEL("produto-add-carrinho"),
        findingText:
          "Abra um produto da lista — este passo continua na página dele.",
      },
      {
        text: "Com o produto no carrinho, toque em Fazer pedido.",
        href: "/carrinho",
        target: SEL("carrinho-fazer-pedido"),
      },
      {
        /* Condicional: sem sessão, o pedido pede entrada ("Entre para
           continuar"); com sessão, é dispensado na hora pelo skipWhen. */
        text: "Sem sessão? Entre com a sua conta para o pedido seguir.",
        target: SEL("pedido-entrar"),
        optional: true,
        skipWhen: SEL("pedido-continuar-endereco"),
        findingText: "Conferindo a sessão…",
      },
      {
        text: "A demonstração preenche e-mail e senha e entra para o pedido seguir.",
        target: SEL("login-entrar"),
        optional: true,
        skipWhen: SEL("pedido-continuar-endereco"),
        fill: [
          { selector: "#login-email", value: "fabio.nascimento@example.com" },
          { selector: "#login-password", value: "bazar2024" },
        ],
        findingText: "Conferindo a sessão…",
      },
      {
        text: "Revise os itens e siga para o endereço.",
        href: "/pedido/novo?from=carrinho",
        target: SEL("pedido-continuar-endereco"),
      },
      {
        text: "Escolha entrega ou retirada e continue para a confirmação.",
        target: SEL("pedido-continuar-confirmacao"),
        findingText: "Avance a etapa do endereço para o botão aparecer.",
      },
      {
        text: "Tudo certo? Confirme que o atendimento do Mix Bazar recebe pelo WhatsApp.",
        target: SEL("pedido-confirmar"),
        findingText: "Siga adiante no pedido — a confirmação surge na última etapa.",
      },
    ],
  },
  {
    id: "cesta",
    label: "Montar uma cesta",
    description: "Crie uma cesta por momento e complete com presentes.",
    icon: ShoppingBag,
    steps: [
      {
        text: "Pela Home, este botão abre suas cestas.",
        href: "/home",
        target: SEL("home-cta-cesta"),
      },
      {
        text: "Crie uma nova cesta para este momento.",
        href: "/cesta",
        target: SEL("cesta-nova"),
      },
      {
        text: "Abaixo, escolha a quantidade e adicione o primeiro produto.",
        target: SEL("cesta-add-produto"),
        findingText: "Selecione ou crie a cesta que quiser completar.",
      },
      {
        text: "Com itens na cesta, toque em Fazer pedido.",
        href: "/cesta",
        target: SEL("cesta-fazer-pedido"),
      },
      {
        text: "Escolha complementos como caixa e cartão, e revise o pedido.",
        target: SEL("complementos-revisar"),
      },
    ],
  },
  {
    id: "conta",
    label: "Entrar na sua conta",
    description: "Sair, entrar e manter seus dados em dia.",
    icon: UserCircle,
    steps: [
      {
        text: "A conta fica por aqui no topo.",
        href: "/home",
        target: SEL("header-conta"),
      },
      {
        text: "Vamos encerrar a sessão para demonstrar o login.",
        href: "/conta",
        target: SEL("conta-sair"),
      },
      {
        text: "Preencha e-mail e senha e toque em Entrar.",
        href: "/login",
        target: SEL("login-entrar"),
        fill: [
          { selector: "#login-email", value: "fabio.nascimento@example.com" },
          { selector: "#login-password", value: "bazar2024" },
        ],
      },
      {
        text: "Logado! Abra seus dados para conferir.",
        href: "/conta",
        target: SEL("conta-dados"),
      },
      {
        text: "Toque em Editar para mudar o que precisar.",
        href: "/conta/dados",
        target: SEL("conta-editar"),
      },
      {
        text: "Revise os campos e salve as alterações.",
        target: SEL("conta-salvar"),
        findingText: "Toque em Editar nos seus dados para o formulário aparecer.",
      },
    ],
  },
  {
    id: "favoritar",
    label: "Guardar favoritos",
    description: "Marque produtos e encontre os guardados depois.",
    icon: Heart,
    steps: [
      {
        text: "No catálogo, toque no coração de um produto para guardar.",
        href: "/catalogo",
        target: SEL("produto-favoritar"),
      },
      {
        text: "Os favoritos ficam por aqui no topo.",
        href: "/catalogo",
        target: SEL("header-favoritos"),
      },
      {
        text: "Aqui estão os produtos guardados, prontos para virar cesta ou pedido.",
        href: "/conta/favoritos",
      },
    ],
  },
  {
    id: "carrinho",
    label: "Guardar no carrinho",
    description: "Produtos e cestas à mão para quando quiser.",
    icon: ShoppingCart,
    steps: [
      {
        text: "No catálogo, toque no + para guardar direto no carrinho.",
        href: "/catalogo",
        target: SEL("produto-add"),
      },
      {
        text: "O contador do topo marca o que você guardou.",
        href: "/catalogo",
        target: SEL("header-carrinho"),
      },
      {
        text: "O carrinho guarda para depois — o pedido se faz pela cesta, com atendimento.",
        href: "/carrinho",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Fluxos do painel do admin                                           */
/* ------------------------------------------------------------------ */

export const ADMIN_TASKS: HelperTask[] = [
  {
    id: "admin-produto",
    label: "Cadastrar produto",
    description: "Abra o formulário, preencha e salve.",
    icon: Package,
    steps: [
      {
        text: "No menu lateral, abra Produtos.",
        href: "/admin/produtos",
        target: SEL("admin-nav-produtos"),
        findingText:
          "Abra a lista no menu lateral — o botão do passo aparece lá.",
      },
      {
        text: "Toque em Novo produto para abrir o formulário.",
        target: SEL("admin-novo"),
        findingText: "Com a lista aberta, o botão Novo produto aparece aí.",
      },
      {
        text: "Preencha nome, categoria, preço e capa. Ao terminar, toque em Salvar.",
        target: SEL("admin-salvar"),
      },
    ],
  },
  {
    id: "admin-cupom",
    label: "Criar cupom",
    description: "Desconto por percentual ou por valor.",
    icon: Ticket,
    steps: [
      {
        text: "No menu lateral, abra Cupons.",
        href: "/admin/cupons",
        target: SEL("admin-nav-cupons"),
        findingText:
          "Abra a lista no menu lateral — o botão do passo aparece lá.",
      },
      {
        text: "Toque em Novo cupom para abrir o formulário.",
        target: SEL("admin-novo"),
        findingText: "Com a lista aberta, o botão Novo cupom aparece aí.",
      },
      {
        text: "Defina código e desconto. Ao terminar, toque em Salvar.",
        target: SEL("admin-salvar"),
      },
    ],
  },
  {
    id: "admin-banner",
    label: "Atualizar banner",
    description: "Troque a capa da Home quando quiser.",
    icon: Images,
    steps: [
      {
        text: "No menu lateral, abra Banners.",
        href: "/admin/banners",
        target: SEL("admin-nav-banners"),
        findingText:
          "Abra a lista no menu lateral — o botão do passo aparece lá.",
      },
      {
        text: "Toque em Novo banner para abrir o formulário.",
        target: SEL("admin-novo"),
        findingText: "Com a lista aberta, o botão Novo banner aparece aí.",
      },
      {
        text: "Escolha imagem, título e posição. Ao terminar, toque em Salvar.",
        target: SEL("admin-salvar"),
      },
    ],
  },
  {
    id: "admin-pedido",
    label: "Avançar pedido",
    description: "Mova o pedido pela linha do atendimento.",
    icon: ClipboardText,
    steps: [
      {
        text: "No menu lateral, abra Pedidos.",
        href: "/admin/pedidos",
        target: SEL("admin-nav-pedidos"),
      },
      {
        text: "Toque na linha de um pedido para ver os detalhes.",
        target: SEL("admin-pedido-linha"),
      },
      {
        text: "Avance o pedido para a próxima etapa do atendimento.",
        target: SEL("admin-pedido-avancar"),
      },
    ],
  },
];
