"use client";

import {
  CaretRight,
  ClipboardText,
  Heart,
  SignOut,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useBasket } from "@/context/basket";
import { useCustomer } from "@/context/customer";

export default function ContaPage() {
  const { profile, favorites, logout } = useCustomer();
  const { orders } = useBasket();
  const router = useRouter();

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  const menu: {
    href: string;
    label: string;
    sub: string;
    icon: typeof UserCircle;
  }[] = [
    {
      href: "/conta/dados",
      label: "Meus dados",
      sub: "Nome, e-mail, telefone e endereço",
      icon: UserCircle,
    },
    {
      href: "/conta/favoritos",
      label: "Meus favoritos",
      sub:
        favorites.length === 0
          ? "Nenhum produto guardado"
          : `${favorites.length} ${favorites.length === 1 ? "produto guardado" : "produtos guardados"}`,
      icon: Heart,
    },
    {
      href: "/pedidos",
      label: "Minhas compras",
      sub:
        orders.length === 0
          ? "Nenhum pedido enviado"
          : `${orders.length} ${orders.length === 1 ? "pedido enviado" : "pedidos enviados"}`,
      icon: ClipboardText,
    },
  ];

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={favorites.length} activePath="/conta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        <section className="pb-10 pt-12 md:pb-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
            Minha conta
          </p>

          <div className="mt-4 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-jungle/10 font-heading text-xl font-semibold text-jungle"
            >
              {initials}
            </span>

            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                {profile.name}
              </h1>

              <p className="mt-1 truncate text-sm text-pine/70">{profile.email}</p>
            </div>
          </div>
        </section>

        <nav aria-label="Seções da conta" className="pb-20 md:pb-24">
          <ul className="grid grid-cols-1 gap-3 md:max-w-2xl">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-4 rounded-card border border-border bg-background px-5 py-4 transition hover:border-jungle"
                  >
                    <Icon
                      size={22}
                      weight="regular"
                      className="shrink-0 text-pine"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block font-heading text-base font-semibold text-gunmetal">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-sm text-pine/70">
                        {item.sub}
                      </span>
                    </span>

                    <CaretRight
                      size={18}
                      weight="bold"
                      className="shrink-0 text-pine/40"
                    />
                  </Link>
                </li>
              );
            })}
            </ul>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="mt-3 flex w-full items-center gap-4 rounded-card border border-border bg-background px-5 py-4 transition hover:border-jungle md:max-w-2xl"
            >
              <SignOut
                size={22}
                weight="regular"
                className="shrink-0 text-pine"
              />

              <span className="min-w-0 flex-1 text-left">
                <span className="block font-heading text-base font-semibold text-gunmetal">
                  Sair
                </span>

                <span className="mt-0.5 block truncate text-sm text-pine/70">
                  Encerrar a sessão atual
                </span>
              </span>

              <CaretRight
                size={18}
                weight="bold"
                className="shrink-0 text-pine/40"
              />
            </button>
          </nav>
      </div>

      <SiteFooter />
    </main>
  );
}
