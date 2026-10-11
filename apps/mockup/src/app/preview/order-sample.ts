import type { BasketItem, ComplementLine } from "@/context/basket";
import { complementGroups, products } from "@/data/catalog";
import type { Coupon } from "@/data/catalog";

function mustFindProduct(id: string) {
  const found = products.find((product) => product.id === id);
  if (!found) {
    throw new Error(`Produto de exemplo não encontrado: ${id}`);
  }
  return found;
}

function mustFindOption(optionId: string) {
  for (const group of complementGroups) {
    const option = group.options.find((item) => item.id === optionId);
    if (option) {
      return { groupId: group.id, option };
    }
  }
  throw new Error(`Complemento de exemplo não encontrado: ${optionId}`);
}

export const sampleItems: BasketItem[] = [
  { product: mustFindProduct("kit-presente"), quantity: 1 },
  { product: mustFindProduct("cesta-cafe"), quantity: 1 },
];

export const sampleComplements: ComplementLine[] = [
  mustFindOption("caixa-kraft"),
  mustFindOption("fita-cetim"),
];

export const sampleCoupon: Coupon = {
  code: "MIX10",
  kind: "percent",
  value: 10,
  description: "10% de desconto",
};

export const sampleAddress = "Rua das Flores, 123 — Centro";

const itemsTotal = sampleItems.reduce(
  (total, item) => total + item.quantity * item.product.priceValue,
  0,
);
const complementsTotal = sampleComplements.reduce(
  (total, line) => total + line.option.priceValue,
  0,
);

export const sampleSubtotal = itemsTotal + complementsTotal;
export const sampleDiscount =
  Math.round(sampleSubtotal * sampleCoupon.value) / 100;
export const sampleTotal = Math.max(0, sampleSubtotal - sampleDiscount);
