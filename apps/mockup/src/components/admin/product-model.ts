import { categories, products } from "@/data/catalog";
import { slugify } from "@/components/admin/category-model";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  priceValue: number;
  oldPriceValue: number | null;
  badge: string | null;
  description: string;
  images: string[];
  active: boolean;
};

export const seedProducts: AdminProduct[] = products.map((product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  priceValue: product.priceValue,
  oldPriceValue: null,
  badge: product.badge ?? null,
  description: product.description,
  images: product.images,
  active: true,
}));

export const productCategories: string[] = categories.map(
  (category) => category.name,
);

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(value: number) {
  return brl.format(value);
}

export function parseBRL(text: string) {
  const normalized = text.trim().replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function productSlug(name: string, taken: Set<string>) {
  const base = slugify(name);
  let id = base;
  let suffix = 2;
  while (taken.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}
