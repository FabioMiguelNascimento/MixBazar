"use client";

import { Tooltip } from "@/components/ui/tooltip";
import { useBasket } from "@/context/basket";
import { useCart } from "@/context/cart";
import { useCustomer } from "@/context/customer";
import {
  ClipboardText,
  Heart,
  MagnifyingGlass,
  ShoppingBag,
  ShoppingCart,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Início", href: "/home" },
  { label: "Categorias", href: "/home#categorias" },
  { label: "Destaques", href: "/home#destaques" },
  { label: "Monte sua cesta", href: "/home#cesta" },
  { label: "Catálogo", href: "/catalogo" },
];

type HeaderAction = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
  showLabel?: boolean;
  wide?: boolean;
  tooltip?: boolean;
};

function HeaderActionItem({
  action,
  active,
}: {
  action: HeaderAction;
  active: boolean;
}) {
  const target = (
    <Link
      href={action.href}
      aria-label={action.label}
      aria-current={active ? "page" : undefined}
      className={`relative flex size-10 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle${
        action.wide === true
          ? " sm:w-auto sm:gap-2 sm:rounded-button sm:px-3"
          : ""
      }`}
    >
      {action.icon}

      {action.showLabel === true && (
        <span className="hidden whitespace-nowrap text-sm font-medium sm:block">
          {action.label}
        </span>
      )}

      {action.badge}
    </Link>
  );

  if (action.tooltip === false) {
    return target;
  }

  return (
    <Tooltip content={action.label} side="bottom" target={target} />
  );
}

export function SiteHeader({
  favoritesCount,
  activePath,
}: {
  favoritesCount: number;
  activePath: string;
}) {
  const { count, orders } = useBasket();
  const { count: cartCount } = useCart();
  const { isLoggedIn } = useCustomer();

  const actions: HeaderAction[] = [
    {
      key: "favorites",
      label: "Favoritos",
      href: "/conta/favoritos",
      icon: <Heart size={20} weight="regular" />,
      badge: favoritesCount > 0 && (
        <span className="absolute right-1 top-1 flex size-2 rounded-full bg-lime ring-2 ring-background" />
      ),
    },
    {
      key: "basket",
      label: "Minha cesta",
      href: "/cesta",
      icon: <ShoppingBag size={20} weight="regular" />,
      showLabel: true,
      wide: true,
      tooltip: false,
      badge: count > 0 && (
        <span
          aria-live="polite"
          className="flex size-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-gunmetal"
        >
          {count}
        </span>
      ),
    },
    {
      key: "orders",
      label: "Meus pedidos",
      href: "/pedidos",
      icon: <ClipboardText size={20} weight="regular" />,
      wide: true,
      badge: orders.length > 0 && (
        <span
          aria-live="polite"
          className="flex size-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-gunmetal"
        >
          {orders.length}
        </span>
      ),
    },
    {
      key: "cart",
      label: "Carrinho",
      href: "/carrinho",
      icon: <ShoppingCart size={20} weight="regular" />,
      badge: cartCount > 0 && (
        <span
          aria-live="polite"
          className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-gunmetal ring-2 ring-background"
        >
          {cartCount}
        </span>
      ),
    },
    {
      key: "account",
      label: isLoggedIn ? "Minha conta" : "Entrar",
      href: isLoggedIn ? "/conta" : "/login",
      icon: <UserCircle size={20} weight="regular" />,
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-5 px-6">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Mix Bazar"
        >
          <img
            src="/mockup/LogoMix.svg"
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
          {actions.map((action) => (
            <HeaderActionItem
              key={action.key}
              action={action}
              active={activePath === action.href}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
