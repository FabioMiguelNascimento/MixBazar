"use client";

import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/context/basket";
import { useCart } from "@/context/cart";
import {
  ArrowRight,
  Basket,
  Minus,
  Plus,
  ShoppingCart,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { Button, buttonStyles } from "@repo/ui";
import Link from "next/link";

export default function CarrinhoPage() {
  const { lines, count, subtotal, setQty, removeLine } = useCart();

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/carrinho" />

      <div className="mx-auto max-w-7xl px-6">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center md:py-24">
            <ShoppingCart size={56} weight="duotone" className="text-pine" />

            <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
              Seu carrinho está vazio
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
              Adicione produtos direto do catálogo
            </p>

            <Link
              href="/catalogo"
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "mt-7",
              })}
            >
              Ver catálogo
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <section className="pb-10 pt-12 md:pb-12 md:pt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Seu carrinho
              </p>

              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                Carrinho
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
                Guarde produtos e cestas aqui. O pedido é feito a partir das
                suas cestas.
              </p>
            </section>

            <div className="grid gap-10 pb-20 md:pb-24 lg:grid-cols-[1fr_360px] lg:gap-12">
              <ul aria-label="Itens do carrinho" className="divide-y divide-border">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex gap-4 py-6 first:pt-0 sm:gap-5"
                  >
                    <div className="relative aspect-[4/4.5] w-24 shrink-0 overflow-hidden rounded-card bg-platinum sm:w-28">
                      {line.image ? (
                        <img
                          src={line.image}
                          alt={line.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-pine">
                          <Basket size={28} weight="duotone" />
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-xs font-medium text-pine/70">
                        {line.kind === "basket"
                          ? `Cesta · ${line.items?.length ?? 0} ${
                              (line.items?.length ?? 0) === 1
                                ? "item"
                                : "itens"
                            }`
                          : "Produto"}
                      </p>

                      <h3 className="mt-1 font-heading text-base font-semibold tracking-tight text-gunmetal">
                        {line.name}
                      </h3>

                      <p className="mt-1 text-sm text-pine/70">
                        {formatPrice(line.unitPrice)} cada
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <div
                          role="group"
                          aria-label={`Quantidade de ${line.name}`}
                          className="flex w-fit items-center gap-1 rounded-button border border-input bg-background p-1"
                        >
                          <Button
                            iconOnly
                            tone="muted"
                            iconSize="sm"
                            label="Diminuir quantidade"
                            onClick={() => setQty(line.id, line.qty - 1)}
                            disabled={line.qty === 1}
                            className="disabled:cursor-not-allowed disabled:opacity-40"
                            icon={<Minus size={14} weight="bold" />}
                          />

                          <span className="w-7 text-center text-sm font-semibold text-gunmetal">
                            {line.qty}
                          </span>

                          <Button
                            iconOnly
                            tone="muted"
                            iconSize="sm"
                            label="Aumentar quantidade"
                            onClick={() => setQty(line.id, line.qty + 1)}
                            icon={<Plus size={14} weight="bold" />}
                          />
                        </div>

                        <span className="font-heading text-base font-semibold text-gunmetal">
                          {formatPrice(line.unitPrice * line.qty)}
                        </span>
                      </div>
                    </div>

                    <Button
                      iconOnly
                      tone="ghost"
                      iconSize="md"
                      label={`Remover ${line.name} do carrinho`}
                      onClick={() => removeLine(line.id)}
                      className="shrink-0 self-start"
                      icon={<Trash size={18} />}
                    />
                  </li>
                ))}
              </ul>

              <aside className="h-fit rounded-card bg-platinum p-6 md:p-7 lg:sticky lg:top-24">
                <h2 className="font-heading text-xl font-semibold tracking-tight text-gunmetal">
                  Resumo
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-pine">Itens no carrinho</dt>
                    <dd className="font-medium text-gunmetal">
                      {count} {count === 1 ? "item" : "itens"}
                    </dd>
                  </div>

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
                  Guarde cestas e produtos aqui e faça o pedido quando quiser.
                </p>

                <Link
                  href="/cesta"
                  className={buttonStyles({
                    variant: "primary",
                    size: "xl",
                    className: "mt-5 w-full",
                  })}
                >
                  Montar cesta
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/catalogo"
                  className={buttonStyles({
                    variant: "outline",
                    size: "lg",
                    className: "mt-3 w-full",
                  })}
                >
                  Continuar explorando
                </Link>
              </aside>
            </div>
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
