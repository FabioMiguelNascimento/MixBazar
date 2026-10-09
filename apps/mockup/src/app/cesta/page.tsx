"use client";

import {
  ArrowRight,
  CheckCircle,
  Minus,
  PencilLine,
  Plus,
  ShoppingBag,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRef, useState } from "react";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, useBasket } from "@/context/basket";

export default function CestaPage() {
  const {
    baskets,
    activeId,
    items,
    count,
    subtotal,
    setQuantity,
    removeItem,
    createBasket,
    switchBasket,
    renameBasket,
    deleteBasket,
    sendActiveBasket,
  } = useBasket();
  const [sentName, setSentName] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const cancelRename = useRef(false);

  const active = baskets.find((basket) => basket.id === activeId) ?? baskets[0];

  if (!active) {
    return null;
  }

  function sendRequest() {
    setSentName(sendActiveBasket());
  }

  function startRename() {
    setDraftName(active.name);
    setEditingId(active.id);
  }

  function commitRename() {
    renameBasket(active.id, draftName);
    setEditingId(null);
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto max-w-7xl px-6">
        {sentName !== null ? (
          <Confirmation
            basketName={sentName}
            onBack={() => setSentName(null)}
          />
        ) : (
          <>
            <section className="pb-10 pt-12 md:pb-12 md:pt-16">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Suas cestas
              </p>

              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                Minhas cestas
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
                Gerencie suas cestas e envie uma solicitação por vez — o Mix
                Bazar confirma tudo pelo atendimento.
              </p>
            </section>

            <div
              role="group"
              aria-label="Escolher cesta"
              className="flex flex-wrap gap-2 pb-8"
            >
              {baskets.map((basket) => {
                const basketCount = basket.items.reduce(
                  (total, item) => total + item.quantity,
                  0,
                );
                const isActive = basket.id === active.id;

                return (
                  <button
                    key={basket.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => switchBasket(basket.id)}
                    className={`inline-flex items-center gap-1.5 rounded-button border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-jungle bg-jungle/10 text-jungle"
                        : "border-border bg-background text-pine hover:border-jungle hover:text-jungle"
                    }`}
                  >
                    {basket.name}
                    <span
                      className={
                        isActive ? "text-xs text-jungle/70" : "text-xs text-pine/60"
                      }
                    >
                      · {basketCount}{" "}
                      {basketCount === 1 ? "item" : "itens"}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                aria-label="Criar nova cesta"
                onClick={createBasket}
                className="inline-flex items-center gap-1.5 rounded-button border border-border bg-background px-4 py-2 text-sm font-medium text-pine transition hover:border-jungle hover:text-jungle"
              >
                <Plus size={15} weight="bold" />
                Nova cesta
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {editingId === active.id ? (
                <input
                  value={draftName}
                  autoFocus
                  maxLength={40}
                  aria-label="Nome da cesta"
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      commitRename();
                    }

                    if (event.key === "Escape") {
                      cancelRename.current = true;
                      event.currentTarget.blur();
                    }
                  }}
                  onBlur={() => {
                    if (cancelRename.current) {
                      cancelRename.current = false;
                      setEditingId(null);
                      return;
                    }

                    commitRename();
                  }}
                  className="rounded-input border border-jungle bg-background px-3 py-2 text-sm font-medium text-gunmetal outline-none"
                />
              ) : (
                <h2 className="font-heading text-xl font-semibold tracking-tight text-gunmetal">
                  {active.name}
                </h2>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Renomear cesta ${active.name}`}
                  onClick={startRename}
                  className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                >
                  <PencilLine size={18} />
                </button>

                <button
                  type="button"
                  aria-label={`Excluir cesta ${active.name}`}
                  title={
                    baskets.length === 1
                      ? "Mantenha ao menos uma cesta"
                      : undefined
                  }
                  disabled={baskets.length === 1}
                  onClick={() => deleteBasket(active.id)}
                  className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="pb-20 md:pb-24">
                <div className="mt-6 rounded-card bg-platinum px-7 py-10 md:px-10 md:py-12">
                  <ShoppingBag
                    size={40}
                    weight="duotone"
                    className="text-pine"
                  />

                  <p className="mt-4 font-heading text-lg font-semibold tracking-tight text-gunmetal">
                    Esta cesta está vazia
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-pine/70">
                    Adicione produtos do catálogo ou escolha outra cesta acima.
                  </p>

                  <Link
                    href="/catalogo"
                    className="mt-6 inline-flex items-center gap-2 rounded-button bg-jungle px-5 py-3 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
                  >
                    Ver catálogo
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-10 pb-20 md:pb-24 lg:grid-cols-[1fr_360px] lg:gap-12">
                <ul
                  aria-label={`Itens da cesta ${active.name}`}
                  className="divide-y divide-border"
                >
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
                    O Mix Bazar confirma sua solicitação pelo atendimento
                    antes de separar os produtos.
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
            )}
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}

function Confirmation({
  basketName,
  onBack,
}: {
  basketName: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center md:py-24">
      <CheckCircle size={64} weight="duotone" className="text-jungle" />

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
        Solicitação enviada
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-pine/70 md:text-base">
        A cesta “{basketName}” foi enviada e o Mix Bazar vai confirmar tudo
        pelo atendimento.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 rounded-button bg-jungle px-6 py-3.5 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
        >
          Voltar ao catálogo
          <ArrowRight size={17} />
        </Link>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-button border border-border bg-background px-6 py-3.5 text-sm font-medium text-gunmetal transition hover:bg-muted"
        >
          Ver minhas cestas
        </button>
      </div>
    </div>
  );
}
