import {
  Basket,
  Flower,
  FolderSimple,
  Gift,
  Package,
  PencilLine,
  Storefront,
  Tag,
} from "@phosphor-icons/react/dist/ssr";
import { categories as catalogCategories, products } from "@/data/catalog";

export type AdminCategory = {
  id: string;
  name: string;
  active: boolean;
  icon: string;
  tint: string;
  image: string;
};

export type PickerId = "icon" | "tint" | "cover";

export const ICONS: Record<string, typeof Basket> = {
  basket: Basket,
  flower: Flower,
  gift: Gift,
  school: PencilLine,
  store: Storefront,
  package: Package,
  folder: FolderSimple,
  tag: Tag,
};

export const TINTS = [
  { label: "Verde", value: "bg-jungle/10 text-jungle" },
  { label: "Pinheiro", value: "bg-pine/10 text-pine" },
  { label: "Lima", value: "bg-lime/25 text-pine" },
  { label: "Neutro", value: "bg-muted text-pine" },
] as const;

const ICON_BY_NAME: Record<string, string> = {
  Cestas: "basket",
  Flores: "flower",
  Presentes: "gift",
  Escolar: "school",
  Bazar: "store",
  Encomendas: "package",
};

export function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug === "" ? "categoria" : slug;
}

export const seedCategories: AdminCategory[] = catalogCategories.map(
  (category) => ({
    id: slugify(category.name),
    name: category.name,
    active: true,
    icon: ICON_BY_NAME[category.name] ?? "folder",
    tint: category.tint,
    image: category.image,
  }),
);

export function productCount(name: string) {
  return products.filter((product) => product.category === name).length;
}
