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

export function formatBare(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(".", ",");
}

export type DiscountType = "none" | "percent" | "value";

export function buildDiscount(
  original: number,
  type: DiscountType,
  amount: number | null,
): { priceValue: number; oldPriceValue: number | null; badge: string | null } {
  if (type === "percent" && amount !== null) {
    const final = Math.round(original * (1 - amount / 100) * 100) / 100;
    return { priceValue: final, oldPriceValue: original, badge: `${amount}% OFF` };
  }
  if (type === "value" && amount !== null) {
    return {
      priceValue: Math.round((original - amount) * 100) / 100,
      oldPriceValue: original,
      badge: `R$ ${formatBare(amount)} OFF`,
    };
  }
  return { priceValue: original, oldPriceValue: null, badge: null };
}

export function parseDiscount(
  badge: string | null,
  original: number | null,
  final: number,
): { type: DiscountType; amount: string } {
  if (badge !== null) {
    const percent = badge.match(/^(\d+)% OFF$/);
    if (percent) return { type: "percent", amount: percent[1] };
    if (badge.startsWith("R$ ") && badge.endsWith(" OFF") && original !== null) {
      const amount = Math.round((original - final) * 100) / 100;
      if (amount > 0) return { type: "value", amount: formatBare(amount) };
    }
  }
  return { type: "none", amount: "" };
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
