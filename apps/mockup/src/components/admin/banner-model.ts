import type { Tone } from "@repo/ui";

export type BannerStatus = "ativa" | "pausada";

export type AdminBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: number;
  active: boolean;
};

export const seedBanners: AdminBanner[] = [
  {
    id: "banner-dia-maes",
    title: "Dia das Mães",
    subtitle: "Cestas a partir de R$ 79,90",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=90",
    link: "/catalogo",
    position: 1,
    active: true,
  },
  {
    id: "banner-inverno",
    title: "Festival de Inverno",
    subtitle: "Presentes que aquecem",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=90",
    link: "/catalogo",
    position: 2,
    active: true,
  },
  {
    id: "banner-retira",
    title: "Retire na loja",
    subtitle: "Ganhe 5% com o cupom RETIROU5",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=90",
    link: "/catalogo",
    position: 3,
    active: false,
  },
];

export const BANNER_STATUS_LABEL: Record<BannerStatus, string> = {
  ativa: "Ativa",
  pausada: "Pausada",
};

export const BANNER_STATUS_TONE: Record<BannerStatus, Tone> = {
  ativa: "jungle",
  pausada: "neutral",
};

export function bannerSlug(name: string, taken: Set<string>) {
  const base =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "banner";
  let id = `banner-${base}`;
  let suffix = 2;
  while (taken.has(id)) {
    id = `banner-${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}
