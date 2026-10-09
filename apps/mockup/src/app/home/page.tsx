"use client";

import {
    ArrowRight,
    Basket,
    Flower,
    Gift,
    Heart,
    MagnifyingGlass,
    Package,
    PencilLine,
    Plus,
    ShoppingBag,
    Storefront,
    Tag
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/* Dados                                                               */
/* ------------------------------------------------------------------ */

type HeroCampaign = {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
};

const heroCampaigns: HeroCampaign[] = [
  {
    title: "Uma cesta do seu jeito, para cada momento.",
    description:
      "Escolha os produtos, monte sua cesta e envie sua solicitação.",
    primaryCta: "Montar minha cesta",
    secondaryCta: "Ver catálogo",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1400&q=90",
  },
  {
    title: "Flores para transformar momentos especiais.",
    description:
      "Encontre flores disponíveis para presentear ou deixar o seu dia mais especial.",
    primaryCta: "Ver flores",
    secondaryCta: "Ver catálogo",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=90",
  },
  {
    title: "Um presente para cada ocasião.",
    description:
      "Encontre ideias para aniversários, comemorações ou simplesmente para surpreender.",
    primaryCta: "Ver presentes",
    secondaryCta: "Ver catálogo",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=90",
  },
];
type Category = {
  name: string;
  icon: typeof Basket;
  tint: string;
  image: string;
};

const categories: Category[] = [
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

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
};

const products: Product[] = [
  {
    id: "cesta-cafe",
    name: "Cesta Café da Manhã",
    category: "Cestas",
    price: "R$ 89,90",
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
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "kit-presente",
    name: "Kit Presente Especial",
    category: "Presentes",
    price: "R$ 74,90",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "kit-papelaria",
    name: "Kit Papelaria Criativa",
    category: "Escolar",
    price: "R$ 42,90",
    oldPrice: "R$ 54,90",
    badge: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=90",
  },
];

/* ------------------------------------------------------------------ */

export default function MockupHome() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const hero = heroCampaigns[heroIndex];

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id],
    );
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <Header favoritesCount={favorites.length} />

      <Hero
        campaign={hero}
        campaignIndex={heroIndex}
        onCampaignChange={setHeroIndex}
      />

      <div className="mx-auto max-w-7xl px-6">
        <Categories />

        <FeaturedProducts
          products={products}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        <CustomBasket />

        <CampaignBanner />

        <SeasonalSection />
      </div>

      <Footer />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Barra de serviço                                                    */
/* ------------------------------------------------------------------ */

function ServiceBar() {
  return (
    <div className="bg-pine px-6 py-2.5 text-center text-xs font-medium text-platinum">
      Faça sua solicitação online e continue o atendimento com o Mix Bazar
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function Header({ favoritesCount }: { favoritesCount: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-5 px-6">
        <a
          href="#"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Mix Bazar"
        >
          <img
            src="/LogoMix.svg"
            alt="Mix Bazar"
            className="size-12 object-contain"
          />

        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          <a
            href="#inicio"
            className="text-sm font-medium text-gunmetal transition hover:text-jungle"
          >
            Início
          </a>

          <a
            href="#categorias"
            className="text-sm font-medium text-pine transition hover:text-jungle"
          >
            Categorias
          </a>

          <a
            href="#destaques"
            className="text-sm font-medium text-pine transition hover:text-jungle"
          >
            Destaques
          </a>

          <a
            href="#cesta"
            className="text-sm font-medium text-pine transition hover:text-jungle"
          >
            Monte sua cesta
          </a>
        </nav>

        <div className="mx-auto hidden h-10 w-full max-w-sm items-center gap-2 rounded-input border border-input bg-background px-3 md:flex lg:max-w-md">
          <MagnifyingGlass
            size={18}
            weight="regular"
            className="shrink-0 text-pine"
          />

          <input
            type="text"
            placeholder="Buscar produtos..."
            className="min-w-0 flex-1 bg-transparent text-sm text-gunmetal outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Favoritos"
            className="relative flex size-10 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
          >
            <Heart size={20} weight="regular" />

            {favoritesCount > 0 && (
              <span className="absolute right-1 top-1 flex size-2 rounded-full bg-lime ring-2 ring-background" />
            )}
          </button>

          <button
            type="button"
            aria-label="Minha cesta"
            className="relative flex size-10 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle sm:w-auto sm:gap-2 sm:rounded-button sm:px-3"
          >
            <ShoppingBag size={20} weight="regular" />

            <span className="hidden text-sm font-medium sm:block">
              Minha cesta
            </span>

            <span className="flex size-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-gunmetal">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

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
      {/* Imagem: metade direita da tela, vaza até a borda */}
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
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-button bg-lime px-6 py-3.5 text-sm font-semibold text-gunmetal transition hover:bg-secondary-hover active:bg-secondary-active"
            >
              {campaign.primaryCta}
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="rounded-button border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {campaign.secondaryCta}
            </button>
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
          <a
            key={category.name}
            href="#destaques"
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
          </a>
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
}: {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <section id="destaques" className="scroll-mt-24 pb-20 md:pb-24">
      <SectionHeader
        title="Produtos em destaque"
        description="Uma seleção de produtos que fazem parte do Mix Bazar."
        action="Ver catálogo"
      />

      <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            favored={favorites.includes(product.id)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Product Card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  favored,
  onToggleFavorite,
}: {
  product: Product;
  favored: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="group">
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-card bg-platinum">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />

        {product.badge && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-button bg-lime px-3 py-1.5 text-xs font-semibold text-gunmetal">
            <Tag size={12} weight="fill" />
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={`Favoritar ${product.name}`}
          onClick={onToggleFavorite}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-platinum/90 text-pine opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:text-jungle focus-visible:opacity-100"
        >
          <Heart
            size={18}
            weight={favored ? "fill" : "regular"}
            className={favored ? "text-jungle" : undefined}
          />
        </button>

        <button
          type="button"
          aria-label={`Adicionar ${product.name} à cesta`}
          className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-jungle text-platinum opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-primary-hover focus-visible:opacity-100"
        >
          <Plus size={19} weight="bold" />
        </button>
      </div>

      <div className="pt-5">
        <p className="text-xs font-medium text-pine/70">
          {product.category}
        </p>

        <h3 className="mt-1 font-heading text-base font-semibold tracking-tight text-gunmetal">
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice}
            </span>
          )}

          <span className="font-heading text-base font-semibold text-gunmetal">
            {product.price}
          </span>
        </div>
      </div>
    </article>
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
            envie a solicitação ao Mix Bazar.
          </p>

          <ol className="mt-7 grid gap-4">
            {[
              "Escolha os produtos que deseja incluir.",
              "Ajuste a composição da sua cesta.",
              "Envie a solicitação para o estabelecimento.",
            ].map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-lime text-xs font-bold text-gunmetal">
                  {index + 1}
                </span>

                <span className="text-sm text-platinum/85">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <button
            type="button"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-button bg-lime px-5 py-3 text-sm font-semibold text-gunmetal transition hover:bg-secondary-hover active:bg-secondary-active"
          >
            Montar minha cesta
            <ArrowRight size={17} />
          </button>
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

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-button bg-jungle px-5 py-3 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
        >
          Explorar novidades
          <ArrowRight size={17} />
        </button>
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
        <a
          href="#"
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
        </a>

        <a
          href="#"
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
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section Header                                                      */
/* ------------------------------------------------------------------ */

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
          {description}
        </p>
      </div>

      {action && (
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-jungle transition hover:text-pine"
        >
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a
              href="#"
              className="flex items-center gap-2.5"
              aria-label="Mix Bazar"
            >
              <img
                src="/logo.svg"
                alt="Mix Bazar"
                className="size-8 object-contain"
              />

              <span className="font-heading text-base font-semibold text-gunmetal">
                Mix Bazar
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-pine/65">
              Cestas, flores, presentes e produtos para diferentes momentos.
              Encontre o que procura e envie sua solicitação.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pine">
              Categorias
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-pine/70">
              {categories.map((category) => (
                <li key={category.name}>
                  <a
                    href="#categorias"
                    className="transition hover:text-jungle"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pine">
              Atendimento
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-pine/70">
              <li>Segunda a sábado</li>
              <li>Consulte os horários do estabelecimento</li>
              <li>Solicitações pelo site e atendimento externo</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-pine/50">
            © {new Date().getFullYear()} Mix Bazar. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}