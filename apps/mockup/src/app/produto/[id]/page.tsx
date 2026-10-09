"use client";

import {
  Basket,
  CaretRight,
  Heart,
  Minus,
  Package,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useBasket } from "@/context/basket";
import { products, recommendedIds } from "@/data/catalog";

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [renderedId, setRenderedId] = useState(id);
  const { addItem } = useBasket();

  const product = products.find((item) => item.id === id);

  // Navegar entre produtos reusa o mesmo componente; reseta o estado por produto.
  if (renderedId !== id) {
    setRenderedId(id);
    setActiveImage(0);
    setQuantity(1);
  }

  function toggleFavorite(productId: string) {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((favorite) => favorite !== productId)
        : [...current, productId],
    );
  }

  const recommended = recommendedIds
    .filter((recommendedId) => recommendedId !== id)
    .flatMap((recommendedId) =>
      products.filter((item) => item.id === recommendedId),
    )
    .slice(0, 4);

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={favorites.length} activePath={pathname} />

      <div className="mx-auto max-w-7xl px-6">
        {!product ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Package size={56} weight="duotone" className="text-pine" />

            <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
              Produto não encontrado
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
              O produto que você procura não está disponível no Mix Bazar no
              momento. Veja as outras opções do catálogo.
            </p>

            <Link
              href="/catalogo"
              className="mt-7 rounded-button border border-border bg-background px-5 py-3 text-sm font-medium text-gunmetal transition hover:bg-muted"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <nav
              aria-label="Trilha de navegação"
              className="flex flex-wrap items-center gap-1.5 py-5 text-sm text-pine"
            >
              <Link href="/catalogo" className="transition hover:text-jungle">
                Catálogo
              </Link>
              <CaretRight size={13} weight="bold" className="text-pine/40" />
              <Link href="/catalogo" className="transition hover:text-jungle">
                {product.category}
              </Link>
              <CaretRight size={13} weight="bold" className="text-pine/40" />
              <span className="text-gunmetal">{product.name}</span>
            </nav>

            <section className="grid gap-10 pb-16 md:grid-cols-[1.2fr_0.8fr] md:pb-20 lg:gap-14">
              {/* Galeria */}
              <div>
                <div className="relative aspect-square overflow-hidden rounded-card bg-platinum">
                  <img
                    src={product.images[activeImage]}
                    alt={`${product.name}, foto ${activeImage + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      aria-label={`Ver foto ${index + 1} de ${product.images.length}`}
                      aria-pressed={index === activeImage}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square overflow-hidden rounded-input border-2 bg-platinum transition ${
                        index === activeImage
                          ? "border-jungle"
                          : "border-transparent hover:border-pine/40"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Informações */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                  {product.category}
                </p>

                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {product.oldPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.oldPrice}
                    </span>
                  )}

                  <span className="font-heading text-2xl font-semibold text-gunmetal md:text-3xl">
                    {product.price}
                  </span>

                  {product.badge && (
                    <span className="rounded-button bg-lime px-3 py-1.5 text-xs font-semibold text-gunmetal">
                      {product.badge}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-sm leading-7 text-pine/75 md:text-base">
                  {product.description}
                </p>

                <div className="mt-7 border-t border-border pt-7">
                  <p
                    id="quantidade-label"
                    className="text-sm font-medium text-gunmetal"
                  >
                    Quantidade
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div
                      role="group"
                      aria-labelledby="quantidade-label"
                      className="flex w-fit items-center gap-1 rounded-button border border-input bg-background p-1"
                    >
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() =>
                          setQuantity((current) => Math.max(1, current - 1))
                        }
                        disabled={quantity === 1}
                        className="flex size-9 items-center justify-center rounded-full text-gunmetal transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={15} weight="bold" />
                      </button>

                      <span className="w-8 text-center text-sm font-semibold text-gunmetal">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => setQuantity((current) => current + 1)}
                        className="flex size-9 items-center justify-center rounded-full text-gunmetal transition hover:bg-muted"
                      >
                        <Plus size={15} weight="bold" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className="inline-flex items-center gap-2 rounded-button border border-border px-4 py-2.5 text-sm font-medium text-gunmetal transition hover:border-jungle hover:text-jungle"
                    >
                      <Heart
                        size={17}
                        weight={
                          favorites.includes(product.id) ? "fill" : "regular"
                        }
                        className={
                          favorites.includes(product.id)
                            ? "text-jungle"
                            : undefined
                        }
                      />
                      {favorites.includes(product.id)
                        ? "Favoritado"
                        : "Favoritar"}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addItem(product, quantity)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-button bg-jungle px-6 py-4 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active sm:w-auto"
                >
                  <Basket size={18} weight="bold" />
                  Adicionar à cesta
                </button>
              </div>
            </section>

            <section className="border-t border-border py-20 md:py-24">
              <SectionHeader
                eyebrow="Sugestões"
                title="Combine com sua cesta"
                description="Uma seleção do Mix Bazar para complementar este produto no seu momento."
                action="Ver catálogo"
                actionHref="/catalogo"
              />

              <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {recommended.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    favored={favorites.includes(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    onAdd={() => addItem(item)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
