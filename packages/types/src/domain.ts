/** Entidades de domínio compartilhadas (exemplo mínimo). */

export interface DiscountApplyInput {
  orderId: string;
  discountCode: string;
}

export interface OrderSummary {
  id: string;
  total: number;
  discountApplied: boolean;
}
