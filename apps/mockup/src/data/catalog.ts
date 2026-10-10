import {
  Basket,
  Flower,
  Gift,
  Package,
  PencilLine,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";

/* ------------------------------------------------------------------ */
/* Dados de catálogo — fonte única compartilhada por Home, /catalogo   */
/* e /produto/[id]                                                     */
/* ------------------------------------------------------------------ */

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=90`;

export type Category = {
  name: string;
  icon: typeof Basket;
  tint: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  oldPrice?: string;
  badge?: string;
  description: string;
  images: string[];
};

export const categories: Category[] = [
  {
    name: "Cestas",
    icon: Basket,
    tint: "bg-jungle/10 text-jungle",
    image: img("1513201099705-a9746e1e201f", 800),
  },
  {
    name: "Flores",
    icon: Flower,
    tint: "bg-pine/10 text-pine",
    image: img("1490750967868-88aa4486c946", 800),
  },
  {
    name: "Presentes",
    icon: Gift,
    tint: "bg-lime/25 text-pine",
    image: img("1549465220-1a8b9238cd48", 800),
  },
  {
    name: "Escolar",
    icon: PencilLine,
    tint: "bg-jungle/10 text-jungle",
    image: img("1452860606245-08befc0ff44b", 800),
  },
  {
    name: "Bazar",
    icon: Storefront,
    tint: "bg-pine/10 text-pine",
    image: img("1528698827591-e19ccd7bc23d", 800),
  },
  {
    name: "Encomendas",
    icon: Package,
    tint: "bg-lime/25 text-pine",
    image: img("1607083206968-13611e3d76db", 800),
  },
];

/* Os 4 primeiros formam a vitrine "Produtos em destaque" da Home.
   images[0] é a foto principal (cards e capa da galeria). */
export const products: Product[] = [
  {
    id: "cesta-cafe",
    name: "Cesta Café da Manhã",
    category: "Cestas",
    price: "R$ 89,90",
    priceValue: 89.9,
    oldPrice: "R$ 109,90",
    badge: "20% OFF",
    description:
      "Um combo aconchegante para começar bem o dia: seleção de pães, frutas frescas e acompanhamentos pensados para o café da manhã. Montada pelo Mix Bazar conforme a disponibilidade do dia.",
    images: [
      img("1490474418585-ba9bad8fd0ea"),
      img("1641924676578-ed2792eb24de"),
      img("1508899203029-1c9eb493c9bd"),
      img("1718942900907-06790d4a852c"),
    ],
  },
  {
    id: "buque-flores",
    name: "Buquê de Flores da Semana",
    category: "Flores",
    price: "R$ 64,90",
    priceValue: 64.9,
    description:
      "Flores frescas selecionadas na semana, montadas em um buquê alegre para presentear ou alegrar a casa. A composição pode variar conforme a disponibilidade da estação.",
    images: [
      img("1490750967868-88aa4486c946"),
      img("1647157201967-4f7520cab994"),
      img("1613341259531-d85824efcb39"),
      img("1560265423-7843b71feeda"),
    ],
  },
  {
    id: "kit-presente",
    name: "Kit Presente Especial",
    category: "Presentes",
    price: "R$ 74,90",
    priceValue: 74.9,
    description:
      "Um presente completo, já embalado com capricho: itens selecionados pelo Mix Bazar para surpreender alguém especial. Ideal para aniversários e ocasiões que pedem um mimo.",
    images: [
      img("1549465220-1a8b9238cd48"),
      img("1617118601021-4992c028fe5d"),
      img("1601307666167-910027240bcd"),
      img("1778686568681-699398da3b65"),
    ],
  },
  {
    id: "kit-papelaria",
    name: "Kit Papelaria Criativa",
    category: "Escolar",
    price: "R$ 42,90",
    priceValue: 42.9,
    oldPrice: "R$ 54,90",
    badge: "20% OFF",
    description:
      "Papelaria criativa para colorir projetos, montar cadernos e brincar de inventar. Perfeito para quem gosta de fazer à mão e para presentear criativos de todas as idades.",
    images: [
      img("1452860606245-08befc0ff44b"),
      img("1758221311831-25a3ec89253d"),
      img("1516053256215-94022213b13c"),
      img("1758221299358-63165fa1258f"),
    ],
  },
  {
    id: "cesta-cha",
    name: "Cesta Chá da Tarde",
    category: "Cestas",
    price: "R$ 79,90",
    priceValue: 79.9,
    description:
      "Uma seleção para a hora do chá: doces, salgadinhos e tudo que combina com uma tarde tranquila. Perfeita para receber visitas ou presentear quem merece.",
    images: [
      img("1589314875269-0a78300506cb"),
      img("1578332199311-59268b20e383"),
      img("1576831438461-6d0e6a13b0ce"),
      img("1671627601461-e0a4f94daa62"),
    ],
  },
  {
    id: "buque-rosas",
    name: "Buquê de Rosas Vermelhas",
    category: "Flores",
    price: "R$ 74,90",
    priceValue: 74.9,
    description:
      "O clássico que nunca falha: buquê de rosas vermelhas frescas, montado na hora. Romântico, elegante e direto ao ponto para celebrar qualquer ocasião.",
    images: [
      img("1512056495345-913a0c261dc8"),
      img("1660809412526-e012e51e2c99"),
      img("1620346328449-f8fb90a40ad5"),
      img("1559779080-6970e0186790"),
    ],
  },
  {
    id: "kit-vinho-queijo",
    name: "Kit Vinho e Queijo",
    category: "Presentes",
    price: "R$ 119,90",
    priceValue: 119.9,
    oldPrice: "R$ 149,90",
    badge: "20% OFF",
    description:
      "Uma pedida certeira para noites agradáveis: combinação de vinho selecionado com queijos e acompanhamentos. Pronto para servir em boas companhias.",
    images: [
      img("1553653760-d787a53b4bbe"),
      img("1517093602195-b40af9688b46"),
      img("1598306442837-613a3def54ff"),
      img("1615199348139-00bf10980769"),
    ],
  },
  {
    id: "kit-escolar-pastel",
    name: "Kit Escolar Pastel",
    category: "Escolar",
    price: "R$ 59,90",
    priceValue: 59.9,
    description:
      "Cadernos, lápis e acessórios em tons pastel para deixar os estudos (e a mesa) mais bonitos. Tudo o que precisa para começar o período com estilo.",
    images: [
      img("1555545624-16240401df02"),
      img("1762318898062-ee8d22f6966c"),
      img("1764818959176-1de3ce67b625"),
      img("1567855354833-ac2c4f967b0c"),
    ],
  },
  {
    id: "caneca-artesanal",
    name: "Caneca Artesanal",
    category: "Bazar",
    price: "R$ 34,90",
    priceValue: 34.9,
    description:
      "Caneca feita à mão, com acabamento rústico e personalidade — cada peça é única. Café, chá ou achocolatado ficam ainda melhores nela.",
    images: [
      img("1536936812504-0e77dc3f0b40"),
      img("1666445844615-0a3930270f13"),
      img("1518358246973-95637f1df901"),
      img("1495100497150-fe209c585f50"),
    ],
  },
  {
    id: "jogo-canecas",
    name: "Jogo de Canecas Rústicas",
    category: "Bazar",
    price: "R$ 89,90",
    priceValue: 89.9,
    description:
      "Jogo de canecas rústicas para o dia a dia ou para receber visitas. Combina com diferentes estilos de cozinha e de mesa, sem perder o charme artesanal.",
    images: [
      img("1590422749897-47036da0b0ff"),
      img("1610701596007-11502861dcfa"),
      img("1725169412537-acd1cd15e10f"),
      img("1570784331625-907b0c979f63"),
    ],
  },
  {
    id: "cesta-personalizada",
    name: "Cesta Personalizada",
    category: "Encomendas",
    price: "R$ 99,90",
    priceValue: 99.9,
    description:
      "Conte o que a pessoa gosta e o Mix Bazar monta a cesta do seu jeito. Você escolhe os produtos, a gente cuida da composição e da embalagem.",
    images: [
      img("1513201099705-a9746e1e201f"),
      img("1773450970959-cef81e9b1053"),
      img("1617394391227-4cb6cba53b12"),
      img("1781263538938-561a5e1acc51"),
    ],
  },
  {
    id: "box-personalizado",
    name: "Box Personalizado",
    category: "Encomendas",
    price: "R$ 69,90",
    priceValue: 69.9,
    description:
      "Um box presenteável com itens à sua escolha, embalado com capricho para a ocasião. Faça seu pedido e o Mix Bazar monta do seu jeito.",
    images: [
      img("1607083206968-13611e3d76db"),
      img("1639562954924-975ca13f454a"),
      img("1548246671-c518156dcc6d"),
      img("1602485178045-7d7159575b1a"),
    ],
  },
];

/* Lista curada da seção "Combine com sua cesta" (fixa no mockup).
   O produto atual é pulado e o 5º entra no lugar. */
export const recommendedIds = [
  "cesta-cafe",
  "buque-rosas",
  "kit-vinho-queijo",
  "caneca-artesanal",
  "kit-presente",
];

/* ------------------------------------------------------------------ */
/* Complementos da cesta — grupos single-select estilo adicionais do  */
/* iFood: no máximo uma opção por grupo em cada cesta.                 */
/* ------------------------------------------------------------------ */

export type ComplementOption = {
  id: string;
  name: string;
  detail: string;
  price: string;
  priceValue: number;
};

export type ComplementGroup = {
  id: "caixa" | "embrulho" | "fita" | "cartao";
  name: string;
  hint: string;
  options: ComplementOption[];
};

export const complementGroups: ComplementGroup[] = [
  {
    id: "caixa",
    name: "Caixa",
    hint: "Escolha uma",
    options: [
      {
        id: "caixa-kraft",
        name: "Caixa kraft",
        detail: "Papelão rígido 20 × 20 cm",
        price: "R$ 8,00",
        priceValue: 8,
      },
      {
        id: "caixa-presente",
        name: "Caixa presente",
        detail: "Estampada 25 × 25 cm",
        price: "R$ 12,00",
        priceValue: 12,
      },
      {
        id: "cesta-vime",
        name: "Cesta de vime",
        detail: "Artesanal com alça",
        price: "R$ 24,00",
        priceValue: 24,
      },
    ],
  },
  {
    id: "embrulho",
    name: "Embrulho",
    hint: "Escolha um",
    options: [
      {
        id: "embrulho-kraft",
        name: "Papel kraft",
        detail: "Com tag do Mix Bazar",
        price: "R$ 4,00",
        priceValue: 4,
      },
      {
        id: "embrulho-presente",
        name: "Papel presente",
        detail: "Estampas da semana",
        price: "R$ 6,00",
        priceValue: 6,
      },
      {
        id: "embrulho-tecido",
        name: "Tecido furoshiki",
        detail: "Reutilizável",
        price: "R$ 14,00",
        priceValue: 14,
      },
    ],
  },
  {
    id: "fita",
    name: "Fita",
    hint: "Escolha uma",
    options: [
      {
        id: "fita-cetim",
        name: "Cetim",
        detail: "Cores sortidas",
        price: "R$ 3,00",
        priceValue: 3,
      },
      {
        id: "fita-rustica",
        name: "Rústica de juta",
        detail: "Acabamento natural",
        price: "R$ 3,00",
        priceValue: 3,
      },
      {
        id: "laco-pronto",
        name: "Laço pronto",
        detail: "Grande, montado à mão",
        price: "R$ 7,00",
        priceValue: 7,
      },
    ],
  },
  {
    id: "cartao",
    name: "Cartão",
    hint: "Escolha um",
    options: [
      {
        id: "cartao-simples",
        name: "Cartão simples",
        detail: "Com mensagem padrão",
        price: "R$ 5,00",
        priceValue: 5,
      },
      {
        id: "cartao-premium",
        name: "Cartão premium",
        detail: "Relevo com envelope",
        price: "R$ 9,00",
        priceValue: 9,
      },
    ],
  },
];
