"use client";

import {
  ArrowRight,
  CheckCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, useBasket } from "@/context/basket";

export default function CestaPage() {
  const { items, count, subtotal, setQuantity, removeItem, clear } =
    useBasket();
  const [sent, setSent] = useState(false);

  function sendRequest() {
    clear();
    setSent(true);
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto max-w-7xl px-6">
        {sent ? (
          <Confirmation />
        ) : items.length === 0 ? (
          <EmptyBasket />
        ) : (
          <>
            <section className="pb-10 pt-12 md:pb-12 md:pt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Sua cesta
              </p>

              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                Minha cesta
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
                Revise os itens e envie sua solicitação — o Mix Bazar confirma
                tudo pelo atendimento.
              </p>
            </section>

            <div className="grid gap-10 pb-20 md:pb-24 lg:grid-cols-[1fr_360px] lg:gap-12">
              <ul aria-label="Itens da cesta" className="divide-y divide-border">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex gap-4 py-6 first:pt-0 sm:gap-5"
                  >
                    <Link
                      href={`/produto/${item.product.id}`}
                      className="block size-24 shrink-0 overflow-hidden rounded-input bg-platinum sm:size-28"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-xs font-medium text-pine/70">
                        {item.product.category}
                      </p>

                      <Link
                        href={`/produto/${item.product.id}`}
                        className="mt-0.5 font-heading text-base font-semibold tracking-tight text-gunmetal transition hover:text-jungle"
                      >
                        {item.product.name}
                      </Link>

                      <p className="mt-1 text-sm text-pine/70">
                        {item.product.price} cada
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <div
                          role="group"
                          aria-label={`Quantidade de ${item.product.name}`}
                          className="flex w-fit items-center gap-1 rounded-button border border-input bg-background p-1"
                        >
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            onClick={() =>
                              setQuantity(
                                item.product.id,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity === 1}
                            className="flex size-8 items-center justify-center rounded-full text-gunmetal transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={14} weight="bold" />
                          </button>

                          <span className="w-7 text-center text-sm font-semibold text-gunmetal">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            onClick={() =>
                              setQuantity(
                                item.product.id,
                                item.quantity + 1,
                              )
                            }
                            className="flex size-8 items-center justify-center rounded-full text-gunmetal transition hover:bg-muted"
                          >
                            <Plus size={14} weight="bold" />
                          </button>
                        </div>

                        <span className="font-heading text-base font-semibold text-gunmetal">
                          {formatPrice(
                            item.product.priceValue * item.quantity,
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remover ${item.product.name} da cesta`}
                      onClick={() => removeItem(item.product.id)}
                      className="flex size-9 shrink-0 items-center justify-center self-start rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                    >
                      <Trash size={18} />
                    </button>
                  </li>
                ))}
              </ul>

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
                  O Mix Bazar confirma sua solicitação pelo atendimento antes
                  de separar os produtos.
                </p>

                <button
                  type="button"
                  onClick={sendRequest}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-button bg-jungle px-6 py-4 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
                >
                  Enviar solicitação
                  <ArrowRight size={17} />
                </button>

                <Link
                  href="/catalogo"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-button border border-border bg-background px-6 py-3.5 text-sm font-medium text-gunmetal transition hover:bg-muted"
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

function EmptyBasket() {
  return (
    <div className="flex flex-col items-center py-20 text-center md:py-24">
      <ShoppingBag size={56} weight="duotone" className="text-pine" />

      <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
        Sua cesta está vazia
      </h1>

      <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
        Explore o catálogo e monte sua cesta do seu jeito.
      </p>

      <Link
        href="/catalogo"
        className="mt-7 inline-flex items-center gap-2 rounded-button bg-jungle px-6 py-3.5 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
      >
        Ver catálogo
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}

function Confirmation() {
  return (
    <div className="flex flex-col items-center py-20 text-center md:py-24">
      <CheckCircle size={64} weight="duotone" className="text-jungle" />

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
        Solicitação enviada
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-pine/70 md:text-base">
        Recebemos sua cesta e o Mix Bazar vai confirmar tudo pelo atendimento.
        Obrigado por montar sua cesta com a gente!
      </p>

      <Link
        href="/catalogo"
        className="mt-8 inline-flex items-center gap-2 rounded-button bg-jungle px-6 py-3.5 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
      >
        Voltar ao catálogo
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
