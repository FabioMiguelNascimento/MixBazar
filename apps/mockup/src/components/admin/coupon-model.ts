import type { Tone } from "@repo/ui";

export type CouponStatus = "ativa" | "pausada";

export type CouponDiscountType = "percent" | "value";

export type AdminCoupon = {
  code: string;
  campaign: string;
  type: CouponDiscountType;
  amount: number;
  used: number;
  limit: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

function isoDaysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const seedCoupons: AdminCoupon[] = [
  {
    code: "MIX10",
    campaign: "Dia das Mães",
    type: "percent",
    amount: 10,
    used: 34,
    limit: 100,
    startsAt: isoDaysFromNow(0),
    endsAt: isoDaysFromNow(2),
    active: true,
  },
  {
    code: "PRESENTE5",
    campaign: "Festival de Inverno",
    type: "value",
    amount: 5,
    used: 12,
    limit: 200,
    startsAt: isoDaysFromNow(0),
    endsAt: isoDaysFromNow(21),
    active: true,
  },
  {
    code: "BEMVIND15",
    campaign: "Boas-vindas",
    type: "percent",
    amount: 15,
    used: 200,
    limit: 200,
    startsAt: isoDaysFromNow(-10),
    endsAt: isoDaysFromNow(30),
    active: true,
  },
  {
    code: "RETIROU5",
    campaign: "Incentivo à retirada",
    type: "value",
    amount: 5,
    used: 3,
    limit: 50,
    startsAt: isoDaysFromNow(0),
    endsAt: isoDaysFromNow(12),
    active: false,
  },
];

export type CouponDisplayStatus = "ativa" | "pausada" | "esgotada";

export function couponStatus(coupon: AdminCoupon): CouponDisplayStatus {
  if (coupon.used >= coupon.limit) return "esgotada";
  return coupon.active ? "ativa" : "pausada";
}

export const COUPON_STATUS_LABEL: Record<CouponDisplayStatus, string> = {
  ativa: "Ativa",
  pausada: "Pausada",
  esgotada: "Esgotada",
};

export const COUPON_STATUS_TONE: Record<CouponDisplayStatus, Tone> = {
  ativa: "jungle",
  pausada: "neutral",
  esgotada: "danger",
};

export function couponDiscountLabel(coupon: Pick<AdminCoupon, "type" | "amount">) {
  return coupon.type === "percent"
    ? `${coupon.amount}% OFF`
    : `R$ ${coupon.amount} OFF`;
}

export function couponUsagePct(coupon: Pick<AdminCoupon, "used" | "limit">) {
  if (coupon.limit <= 0) return 0;
  return Math.min(100, Math.round((coupon.used / coupon.limit) * 100));
}

function formatShortDate(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function couponValidityLabel(coupon: Pick<AdminCoupon, "startsAt" | "endsAt">) {
  const [startYear] = coupon.startsAt.split("-");
  const [, endYear] = coupon.endsAt.split("-");
  const start = formatShortDate(coupon.startsAt).slice(0, 5);
  if (startYear === endYear) return `${start} – ${formatShortDate(coupon.endsAt)}`;
  return `${formatShortDate(coupon.startsAt)} – ${formatShortDate(coupon.endsAt)}`;
}

export function couponDateError(startsAt: string, endsAt: string): string | null {
  if (startsAt === "" || endsAt === "") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startsAt) || !/^\d{4}-\d{2}-\d{2}$/.test(endsAt)) {
    return "Use datas válidas.";
  }
  if (endsAt < startsAt) {
    return "O término precisa ser depois do início.";
  }
  return null;
}

export const COUPON_CODE_PATTERN = /^[A-Z0-9]{5,10}$/;

export function couponCodeError(code: string): string | null {
  if (code.trim() === "") return "Informe o código do cupom.";
  if (!COUPON_CODE_PATTERN.test(code.trim().toUpperCase())) {
    return "Use de 5 a 10 letras e números, sem espaço.";
  }
  return null;
}
