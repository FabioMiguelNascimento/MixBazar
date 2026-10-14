import type { Tone } from "@repo/ui";

export type CampaignStatus = "ativa" | "pausada" | "agendada" | "encerrada";

export type AdminCampaignFull = {
  id: string;
  name: string;
  couponCode: string;
  startsAt: string;
  endsAt: string;
  used: number;
  limit: number;
  active: boolean;
  scheduled: boolean;
  productIds: string[];
};

function isoDaysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const seedCampaignsFull: AdminCampaignFull[] = [
  {
    id: "camp-maes",
    name: "Dia das Mães",
    couponCode: "MIX10",
    startsAt: isoDaysFromNow(0),
    endsAt: isoDaysFromNow(2),
    used: 34,
    limit: 100,
    active: true,
    scheduled: false,
    productIds: ["cesta-cafe", "buque-rosas", "kit-presente"],
  },
  {
    id: "camp-inverno",
    name: "Festival de Inverno",
    couponCode: "PRESENTE5",
    startsAt: isoDaysFromNow(0),
    endsAt: isoDaysFromNow(21),
    used: 12,
    limit: 200,
    active: true,
    scheduled: false,
    productIds: ["kit-vinho-queijo", "cesta-cha"],
  },
  {
    id: "camp-namorados",
    name: "Dia dos Namorados",
    couponCode: "AMOR15",
    startsAt: isoDaysFromNow(30),
    endsAt: isoDaysFromNow(45),
    used: 0,
    limit: 150,
    active: true,
    scheduled: true,
    productIds: [],
  },
];

export function campaignStatus(campaign: AdminCampaignFull): CampaignStatus {
  const today = new Date().toISOString().slice(0, 10);
  if (campaign.endsAt < today) return "encerrada";
  if (campaign.startsAt > today) return "agendada";
  if (campaign.used >= campaign.limit) return "encerrada";
  return campaign.active ? "ativa" : "pausada";
}

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  ativa: "Ativa",
  pausada: "Pausada",
  agendada: "Agendada",
  encerrada: "Encerrada",
};

export const CAMPAIGN_STATUS_TONE: Record<CampaignStatus, Tone> = {
  ativa: "jungle",
  pausada: "neutral",
  agendada: "info",
  encerrada: "danger",
};

function formatShortDate(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function campaignPeriodLabel(campaign: Pick<AdminCampaignFull, "startsAt" | "endsAt">) {
  const [startYear] = campaign.startsAt.split("-");
  const [, endYear] = campaign.endsAt.split("-");
  const start = formatShortDate(campaign.startsAt).slice(0, 5);
  if (startYear === endYear) return `${start} – ${formatShortDate(campaign.endsAt)}`;
  return `${formatShortDate(campaign.startsAt)} – ${formatShortDate(campaign.endsAt)}`;
}

export function campaignDateError(startsAt: string, endsAt: string): string | null {
  if (startsAt === "" || endsAt === "") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startsAt) || !/^\d{4}-\d{2}-\d{2}$/.test(endsAt)) {
    return "Use datas válidas.";
  }
  if (endsAt < startsAt) {
    return "O término precisa ser depois do início.";
  }
  return null;
}

export function campaignSlug(name: string, taken: Set<string>) {
  const base =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "campanha";
  let id = `camp-${base}`;
  let suffix = 2;
  while (taken.has(id)) {
    id = `camp-${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}
