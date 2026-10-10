"use client";

import {
  ArrowRight,
  CaretRight,
  ShoppingBag,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Confirmation } from "@/components/order-confirmation";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, useBasket, type Order } from "@/context/basket";
import {
  complementGroups,
  type ComplementGroup,
  type ComplementOption,
} from "@/data/catalog";
import { Button, buttonStyles } from "@repo/ui";

function ComplementGroupBlock({
  group,
  selectedId,
  onToggle,
}: {
  group: ComplementGroup;
  selectedId: string | undefined;
  onToggle: (option: ComplementOption) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-heading text-base font-semibold tracking-tight text-gunmetal">
          {group.name}
        </h3>

        <p className="shrink-0 text-xs text-pine/70">{group.hint}</p>
      </div>

      <div
        role="radiogroup"
        aria-label={group.name}
        className="mt-3 grid gap-2"
      >
        {group.options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onToggle(option)}
              className={`flex w-full items-center gap-3 rounded-button border px-4 py-3 text-left transition ${
                selected
                  ? "border-jungle bg-jungle/10"
                  : "border-border bg-background hover:border-jungle"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  selected ? "border-jungle" : "border-input"
                }`}
              >
                {selected && (
                  <span className="size-2.5 rounded-full bg-jungle" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gunmetal">
                  {option.name}
                </span>

                <span className="mt-0.5 block truncate text-xs text-pine/70">
                  {option.detail}
                </span>
              </span>

              <span className="shrink-0 text-sm font-semibold text-gunmetal">
                {option.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ComplementosPage() {
  const {
    baskets,
    activeId,
    items,
    complements,
    count,
    subtotal,
    toggleComplement,
    sendActiveBasket,
  } = useBasket();
  const [sent, setSent] = useState<Order | null>(null);
  const router = useRouter();

  const active = baskets.find((basket) => basket.id === activeId) ?? baskets[0];

  if (sent !== null) {
    return (
      <main className="flex min-h-svh flex-col bg-background text-foreground">
        <ServiceBar />

        <SiteHeader favoritesCount={0} activePath="/cesta" />

        <div className="mx-auto w-full max-w-7xl flex-1 px-6">
          <Confirmation
            number={sent.number}
            basketName={sent.name}
            onBack={() => router.push("/cesta")}
          />
        </div>

        <SiteFooter />
      </main>
    );
  }

  if (!active || items.length === 0) {
    return (
      <main className="flex min-h-svh flex-col bg-background text-foreground">
        <ServiceBar />

        <SiteHeader favoritesCount={0} activePath="/cesta" />

        <div className="mx-auto w-full max-w-7xl flex-1 px-6">
          <div className="flex flex-col items-center py-20 text-center md:py-24">
            <ShoppingBag
              size={56}
              weight="duotone"
              className="text-pine"
            />

            <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
              Sua cesta está vazia
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
              Adicione produtos antes de escolher complementos.
            </p>

            <Link
              href="/cesta"
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "mt-7",
              })}
            >
              Voltar para a cesta
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        <nav
          aria-label="Trilha de navegação"
          className="flex flex-wrap items-center gap-1.5 pt-8 text-sm text-pine"
        >
          <Link href="/cesta" className="transition hover:text-jungle">
            Minhas cestas
          </Link>

          <CaretRight size={13} weight="bold" className="text-pine/40" />

          <span aria-current="page" className="text-gunmetal">
            Complementos
          </span>
        </nav>

        <div className="pb-10 pt-6 md:pb-12">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
            Complementos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
            Finalize “{active.name}” com caixa, embrulho, fita e cartão.
          </p>
        </div>

        <div className="mt-10 grid gap-10 pb-20 md:pb-24 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <ul
              aria-label={`Itens da cesta ${active.name}`}
              className="divide-y divide-border rounded-card border border-border bg-background px-5"
            >
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center gap-3 py-3"
                >
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="size-12 shrink-0 rounded-input object-cover"
                  />

                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-gunmetal">
                    {item.product.name}{" "}
                    <span className="text-pine/70">× {item.quantity}</span>
                  </p>

                  <span className="shrink-0 text-sm font-semibold text-gunmetal">
                    {formatPrice(
                      item.product.priceValue * item.quantity,
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {complementGroups.map((group) => (
                <ComplementGroupBlock
                  key={group.id}
                  group={group}
                  selectedId={
                    complements.find((line) => line.groupId === group.id)
                      ?.option.id
                  }
                  onToggle={(option) => toggleComplement(group.id, option)}
                />
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-card bg-platinum p-6 md:p-7 lg:sticky lg:top-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-gunmetal">
              Resumo
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pine">Itens na cesta</dt>
                <dd className="font-medium text-gunmetal">
                  {count} {count === 1 ? "item" : "itens"}
                </dd>
              </div>

              {complements.length > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-pine">Complementos</dt>
                  <dd className="font-medium text-gunmetal">
                    {complements.length}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-gunmetal/10 pt-3">
                <dt className="font-heading text-base font-semibold text-gunmetal">
                  Subtotal
                </dt>
                <dd className="font-heading text-base font-semibold text-gunmetal">
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-5 text-pine/70">
              O Mix Bazar confirma seu pedido pelo atendimento antes de
              separar os produtos.
            </p>

            <Button
              variant="primary"
              size="xl"
              onClick={() => setSent(sendActiveBasket())}
              className="mt-5 w-full"
            >
              Enviar pedido
              <ArrowRight size={17} />
            </Button>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
