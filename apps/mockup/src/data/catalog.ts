import {
  Basket,
  Flower,
  Gift,
  Package,
  PencilLine,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";

/* ------------------------------------------------------------------ */
/* Dados de catálogo — fonte única compartilhada por Home e /catalogo  */
/* ------------------------------------------------------------------ */

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
  image: string;
};

export const categories: Category[] = [
  {
    name: "Cestas",
    icon: Basket,
    tint: "bg-jungle/10 text-jungle",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=90",
  },
  {
    name: "Flores",
    icon: Flower,
    tint: "bg-pine/10 text-pine",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=90",
  },
  {
    name: "Presentes",
    icon: Gift,
    tint: "bg-lime/25 text-pine",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=90",
  },
  {
    name: "Escolar",
    icon: PencilLine,
    tint: "bg-jungle/10 text-jungle",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=90",
  },
  {
    name: "Bazar",
    icon: Storefront,
    tint: "bg-pine/10 text-pine",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=90",
  },
  {
    name: "Encomendas",
    icon: Package,
    tint: "bg-lime/25 text-pine",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=800&q=90",
  },
];

/* Os 4 primeiros formam a vitrine "Produtos em destaque" da Home. */
export const products: Product[] = [
  {
    id: "cesta-cafe",
    name: "Cesta Café da Manhã",
    category: "Cestas",
    price: "R$ 89,90",
    priceValue: 89.9,
    oldPrice: "R$ 109,90",
    badge: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "buque-flores",
    name: "Buquê de Flores da Semana",
    category: "Flores",
    price: "R$ 64,90",
    priceValue: 64.9,
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "kit-presente",
    name: "Kit Presente Especial",
    category: "Presentes",
    price: "R$ 74,90",
    priceValue: 74.9,
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "kit-papelaria",
    name: "Kit Papelaria Criativa",
    category: "Escolar",
    price: "R$ 42,90",
    priceValue: 42.9,
    oldPrice: "R$ 54,90",
    badge: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "cesta-cha",
    name: "Cesta Chá da Tarde",
    category: "Cestas",
    price: "R$ 79,90",
    priceValue: 79.9,
    image:
      "https://images.unsplash.com/photo-1589314875269-0a78300506cb?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "buque-rosas",
    name: "Buquê de Rosas Vermelhas",
    category: "Flores",
    price: "R$ 74,90",
    priceValue: 74.9,
    image:
      "https://images.unsplash.com/photo-1512056495345-913a0c261dc8?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "kit-vinho-queijo",
    name: "Kit Vinho e Queijo",
    category: "Presentes",
    price: "R$ 119,90",
    priceValue: 119.9,
    oldPrice: "R$ 149,90",
    badge: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1553653760-d787a53b4bbe?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "kit-escolar-pastel",
    name: "Kit Escolar Pastel",
    category: "Escolar",
    price: "R$ 59,90",
    priceValue: 59.9,
    image:
      "https://images.unsplash.com/photo-1555545624-16240401df02?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "caneca-artesanal",
    name: "Caneca Artesanal",
    category: "Bazar",
    price: "R$ 34,90",
    priceValue: 34.9,
    image:
      "https://images.unsplash.com/photo-1536936812504-0e77dc3f0b40?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "jogo-canecas",
    name: "Jogo de Canecas Rústicas",
    category: "Bazar",
    price: "R$ 89,90",
    priceValue: 89.9,
    image:
      "https://images.unsplash.com/photo-1590422749897-47036da0b0ff?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "cesta-personalizada",
    name: "Cesta Personalizada",
    category: "Encomendas",
    price: "R$ 99,90",
    priceValue: 99.9,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "box-personalizado",
    name: "Box Personalizado",
    category: "Encomendas",
    price: "R$ 69,90",
    priceValue: 69.9,
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1000&q=90",
  },
];
