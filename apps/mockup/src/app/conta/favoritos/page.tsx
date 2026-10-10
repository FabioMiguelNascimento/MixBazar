"use client";

import {
  ArrowRight,
  CaretRight,
  Heart,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useBasket } from "@/context/basket";
import { useCustomer } from "@/context/customer";
import { products } from "@/data/catalog";

export default function FavoritosPage() {
  const { favorites, toggleFavorite, isLoggedIn } = useCustomer();
  const { addItem } = useBasket();

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id),
  );

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={favorites.length} activePath="/conta" />

      <div className="mx-auto max-w-7xl px-6">
        <nav
          aria-label="Trilha de navegação"
          className="flex flex-wrap items-center gap-1.5 py-5 text-sm text-pine"
        >
          <Link href="/conta" className="transition hover:text-jungle">
            Minha conta
          </Link>
          <CaretRight size={13} weight="bold" className="text-pine/40" />
          <span className="text-gunmetal">Meus favoritos</span>
        </nav>

        <section className="pb-20 md:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
            Minha conta
          </p>

          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
            Meus favoritos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
            Os produtos que você guardou para ver depois.
          </p>

          {favoriteProducts.length === 0 ? (
            <div className="mt-10 rounded-card bg-platinum px-7 py-10 md:px-10">
              <Heart size={40} weight="duotone" className="text-pine" />

              <p className="mt-4 font-heading text-lg font-semibold tracking-tight text-gunmetal">
                Você ainda não favoritou nada
              </p>

              <p className="mt-2 max-w-md text-sm leading-6 text-pine/70">
                Toque no coração de um produto para guardá-lo aqui.
              </p>

              <Link
                href="/catalogo"
                className="mt-6 inline-flex items-center gap-2 rounded-button border border-border bg-background px-5 py-3 text-sm font-medium text-gunmetal transition hover:bg-muted"
              >
                Ver catálogo
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favored
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAdd={() => addItem(product)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
