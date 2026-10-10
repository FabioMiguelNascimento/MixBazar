"use client";

import {
  ArrowRight,
  CaretDown,
  Package,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useBasket } from "@/context/basket";
import { categories, products, type Product } from "@/data/catalog";

type SortKey = "destaques" | "menor" | "maior" | "az";

const PAGE_SIZE = 8;

function sortProducts(list: Product[], sort: SortKey): Product[] {
  switch (sort) {
    case "menor":
      return list.toSorted((a, b) => a.priceValue - b.priceValue);
    case "maior":
      return list.toSorted((a, b) => b.priceValue - a.priceValue);
    case "az":
      return list.toSorted((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "destaques":
      return list;
  }
}

export default function CatalogoPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("destaques");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { addItem } = useBasket();

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id],
    );
  }

  function selectCategory(category: string | null) {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;
  const visible = sortProducts(filtered, sort);
  const shown = visible.slice(0, visibleCount);
  const hasMore = visibleCount < visible.length;

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={favorites.length} activePath="/catalogo" />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pb-10 pt-12 md:pb-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
            Mix Bazar
          </p>

          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
            Catálogo
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
            Todos os produtos disponíveis no Mix Bazar. Filtre por categoria,
            monte sua cesta e faça seu pedido.
          </p>
        </section>

        <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
          <div
            role="group"
            aria-label="Filtrar por categoria"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              aria-pressed={activeCategory === null}
              onClick={() => selectCategory(null)}
              className={`rounded-button border px-4 py-2 text-sm font-medium transition ${
                activeCategory === null
                  ? "border-jungle bg-jungle/10 text-jungle"
                  : "border-border bg-background text-pine hover:border-jungle hover:text-jungle"
              }`}
            >
              Todos
            </button>

            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    selectCategory(isActive ? null : category.name)
                  }
                  className={`inline-flex items-center gap-1.5 rounded-button border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-jungle bg-jungle/10 text-jungle"
                      : "border-border bg-background text-pine hover:border-jungle hover:text-jungle"
                  }`}
                >
                  <Icon size={16} weight="regular" />
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <p aria-live="polite" className="text-sm text-pine">
              {visible.length}{" "}
              {visible.length === 1 ? "produto" : "produtos"}
            </p>

            <label htmlFor="ordem" className="sr-only">
              Ordenar por
            </label>

            <select
              id="ordem"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-input border border-input bg-background px-3 py-2 text-sm text-gunmetal outline-none"
            >
              <option value="destaques">Destaques</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
              <option value="az">Nome A–Z</option>
            </select>
          </div>
        </div>

        {shown.length > 0 ? (
          <div className="pb-16 pt-10">
            <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favored={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAdd={() => addItem(product)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) => count + PAGE_SIZE)
                  }
                  className="inline-flex items-center gap-2 rounded-button border border-border bg-background px-5 py-3 text-sm font-medium text-gunmetal transition hover:bg-muted"
                >
                  Carregar mais
                  <CaretDown size={16} weight="bold" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Package size={56} weight="duotone" className="text-pine" />

            <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight text-gunmetal md:text-2xl">
              Nenhum produto encontrado
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-pine/70">
              Não temos produtos em “{activeCategory}” no momento. Veja as
              outras opções do Mix Bazar.
            </p>

            <button
              type="button"
              onClick={() => selectCategory(null)}
              className="mt-6 rounded-button border border-border bg-background px-5 py-3 text-sm font-medium text-gunmetal transition hover:bg-muted"
            >
              Limpar filtros
            </button>
          </div>
        )}

        <section className="pb-20 md:pb-24">
          <div className="grid items-center gap-8 rounded-card bg-platinum px-7 py-10 md:grid-cols-[1fr_auto] md:px-10 md:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Monte do seu jeito
              </p>

              <h2 className="mt-3 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
                Não achou o que queria? Monte sua cesta.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/75">
                Escolha os produtos que combinam com o momento e faça seu
                pedido — o Mix Bazar cuida do resto.
              </p>
            </div>

            <Link
              href="/cesta"
              className="inline-flex w-fit items-center gap-2 rounded-button bg-jungle px-5 py-3 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
            >
              Montar minha cesta
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
