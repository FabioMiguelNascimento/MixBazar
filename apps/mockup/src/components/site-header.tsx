"use client";

import {
  Heart,
  MagnifyingGlass,
  ShoppingBag,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useBasket } from "@/context/basket";

const navItems = [
  { label: "Início", href: "/home" },
  { label: "Categorias", href: "/home#categorias" },
  { label: "Destaques", href: "/home#destaques" },
  { label: "Monte sua cesta", href: "/home#cesta" },
  { label: "Catálogo", href: "/catalogo" },
];

export function SiteHeader({
  favoritesCount,
  activePath,
}: {
  favoritesCount: number;
  activePath: string;
}) {
  const { count } = useBasket();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-5 px-6">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Mix Bazar"
        >
          <img
            src="/LogoMix.svg"
            alt="Mix Bazar"
            className="size-12 object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`whitespace-nowrap text-sm font-medium transition hover:text-jungle ${
                activePath === item.href ? "text-gunmetal" : "text-pine"
              }`}
              aria-current={activePath === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
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

          <Link
            href="/cesta"
            aria-label="Minha cesta"
            aria-current={activePath === "/cesta" ? "page" : undefined}
            className="relative flex size-10 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle sm:w-auto sm:gap-2 sm:rounded-button sm:px-3"
          >
            <ShoppingBag size={20} weight="regular" />

            <span className="hidden whitespace-nowrap text-sm font-medium sm:block">
              Minha cesta
            </span>

            {count > 0 && (
              <span
                aria-live="polite"
                className="flex size-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-gunmetal"
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
