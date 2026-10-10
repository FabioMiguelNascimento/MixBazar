"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/context/cart";
import { useCustomer } from "@/context/customer";
import { categories, products, type Product } from "@/data/catalog";
import { buttonStyles } from "@repo/ui";

/* ------------------------------------------------------------------ */
/* Dados                                                               */
/* ------------------------------------------------------------------ */

type HeroCampaign = {
  title: string;
  description: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  image: string;
};

const heroCampaigns: HeroCampaign[] = [
  {
    title: "Uma cesta do seu jeito, para cada momento.",
    description:
      "Escolha os produtos, monte sua cesta e faça seu pedido.",
    primaryCta: "Montar minha cesta",
    primaryHref: "/cesta",
    secondaryCta: "Ver catálogo",
    secondaryHref: "/catalogo",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1400&q=90",
  },
  {
    title: "Flores para transformar momentos especiais.",
    description:
      "Encontre flores disponíveis para presentear ou deixar o seu dia mais especial.",
    primaryCta: "Ver flores",
    primaryHref: "/catalogo",
    secondaryCta: "Ver catálogo",
    secondaryHref: "/catalogo",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=90",
  },
  {
    title: "Um presente para cada ocasião.",
    description:
      "Encontre ideias para aniversários, comemorações ou simplesmente para surpreender.",
    primaryCta: "Ver presentes",
    primaryHref: "/catalogo",
    secondaryCta: "Ver catálogo",
    secondaryHref: "/catalogo",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=90",
  },
];

export default function MockupHome() {
  const [heroIndex, setHeroIndex] = useState(0);
  const { addProduct } = useCart();
  const { favorites, toggleFavorite } = useCustomer();

  const hero = heroCampaigns[heroIndex];

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={favorites.length} activePath="/home" />

      <Hero
        campaign={hero}
        campaignIndex={heroIndex}
        onCampaignChange={setHeroIndex}
      />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        <Categories />

        <FeaturedProducts
          products={products.slice(0, 4)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddItem={addProduct}
        />

        <CustomBasket />

        <CampaignBanner />

        <SeasonalSection />
      </div>

      <SiteFooter />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({
  campaign,
  campaignIndex,
  onCampaignChange,
}: {
  campaign: HeroCampaign;
  campaignIndex: number;
  onCampaignChange: (index: number) => void;
}) {
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-jungle">
      {/* Imagem: metade direita da tela, vai até a borda */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
        <img
          key={campaign.image}
          src={campaign.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-500"
        />
      </div>

      {/* Imagem no mobile: faixa no topo */}
      <div className="relative h-56 md:hidden">
        <img
          key={`m-${campaign.image}`}
          src={campaign.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Conteúdo alinhado ao container da página */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative z-10 flex flex-col justify-center py-12 md:min-h-[480px] md:w-1/2 md:py-16 md:pr-12">
          <h1 className="mt-6 max-w-md font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-white lg:text-[2.75rem]">
            {campaign.title}
          </h1>

          <p className="mt-5 max-w-sm text-base leading-7 text-white/80">
            {campaign.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={campaign.primaryHref}
              className={buttonStyles({ variant: "accent", size: "lg" })}
            >
              {campaign.primaryCta}
              <ArrowRight size={17} />
            </Link>

            <Link
              href={campaign.secondaryHref}
              className={buttonStyles({ variant: "outlineDark", size: "lg" })}
            >
              {campaign.secondaryCta}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-1">
            {heroCampaigns.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Ver campanha ${index + 1}`}
                aria-current={index === campaignIndex}
                onClick={() => onCampaignChange(index)}
                className="group -m-1 p-2"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    index === campaignIndex
                      ? "w-8 bg-lime"
                      : "w-1.5 bg-white/40 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

function Categories() {
  return (
    <section id="categorias" className="scroll-mt-24 py-20 md:py-24">
      <SectionHeader
        title="Encontre o que procura"
        description="Explore as categorias do Mix Bazar e descubra produtos para diferentes momentos."
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href="/catalogo"
            className="group relative aspect-[4/5] overflow-hidden rounded-card bg-platinum"
          >
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/75 via-gunmetal/5 to-transparent" />

            <div className="absolute inset-x-4 bottom-4">
              <span className="font-heading text-base font-semibold text-platinum md:text-lg">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Produtos em destaque                                                */
/* ------------------------------------------------------------------ */

function FeaturedProducts({
  products,
  favorites,
  onToggleFavorite,
  onAddItem,
}: {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddItem: (product: Product) => void;
}) {
  return (
    <section id="destaques" className="scroll-mt-24 pb-20 md:pb-24">
      <SectionHeader
        title="Produtos em destaque"
        description="Uma seleção de produtos que fazem parte do Mix Bazar."
        action="Ver catálogo"
        actionHref="/catalogo"
      />

      <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            favored={favorites.includes(product.id)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
            onAdd={() => onAddItem(product)}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Monte sua cesta                                                     */
/* ------------------------------------------------------------------ */

function CustomBasket() {
  return (
    <section id="cesta" className="scroll-mt-24 pb-20 md:pb-24">
      <div className="grid overflow-hidden rounded-card bg-gunmetal lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[360px] lg:min-h-[470px]">
          <img
            src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1400&q=90"
            alt="Cesta personalizada"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/40 to-transparent" />
        </div>

        <div className="flex flex-col justify-center px-7 py-12 md:px-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
            Um diferencial do Mix Bazar
          </p>

          <h2 className="mt-4 max-w-lg font-heading text-3xl font-semibold leading-tight tracking-tight text-platinum md:text-4xl">
            Monte uma cesta do seu jeito.
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-6 text-platinum/70 md:text-base">
            Escolha os produtos que deseja incluir, organize sua composição e
            envie o pedido ao Mix Bazar.
          </p>

          <ol className="mt-7 grid gap-4">
            {[
              "Escolha os produtos que deseja incluir.",
              "Ajuste a composição da sua cesta.",
              "Envie o pedido para o estabelecimento.",
            ].map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-lime text-xs font-bold text-gunmetal">
                  {index + 1}
                </span>

                <span className="text-sm text-platinum/85">{step}</span>
              </li>
            ))}
          </ol>

          <Link
            href="/cesta"
            className={buttonStyles({
              variant: "accent",
              size: "md",
              className: "mt-8 w-fit",
            })}
          >
            Montar minha cesta
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Campanha secundária                                                 */
/* ------------------------------------------------------------------ */

function CampaignBanner() {
  return (
    <section className="pb-20 md:pb-24">
      <div className="grid items-center gap-8 rounded-card bg-platinum px-7 py-10 md:grid-cols-[1fr_auto] md:px-10 md:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
            Destaque da semana
          </p>

          <h2 className="mt-3 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
            Novidades e produtos sazonais para descobrir.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/75">
            Confira as novidades disponíveis no Mix Bazar e encontre produtos
            para presentear, comemorar ou aproveitar no dia a dia.
          </p>
        </div>

        <Link
          href="/catalogo"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "w-fit",
          })}
        >
          Explorar novidades
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Seção sazonal                                                       */
/* ------------------------------------------------------------------ */

function SeasonalSection() {
  return (
    <section className="border-t border-border py-20 md:py-24">
      <div className="grid gap-6 md:grid-cols-[1.35fr_0.65fr]">
        <Link
          href="/catalogo"
          className="group relative min-h-[300px] overflow-hidden rounded-card"
        >
          <img
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=90"
            alt="Flores da estação"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/80 via-gunmetal/10 to-transparent" />

          <div className="absolute bottom-7 left-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
              Flores
            </p>

            <h2 className="mt-2 font-heading text-2xl font-semibold text-platinum md:text-3xl">
              Para momentos especiais.
            </h2>

            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-platinum">
              Ver produtos
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        <Link
          href="/catalogo"
          className="group relative min-h-[300px] overflow-hidden rounded-card"
        >
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=90"
            alt="Presentes"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/80 via-gunmetal/10 to-transparent" />

          <div className="absolute bottom-7 left-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
              Presentes
            </p>

            <h2 className="mt-2 font-heading text-2xl font-semibold text-platinum">
              Algo especial para alguém.
            </h2>

            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-platinum">
              Ver produtos
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
