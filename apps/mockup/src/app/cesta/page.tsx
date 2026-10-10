"use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle,
  Minus,
  PencilLine,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRef, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatPrice,
  MAX_BASKETS,
  useBasket,
  type Order,
} from "@/context/basket";
import { useCart } from "@/context/cart";
import { products, type Product } from "@/data/catalog";
import { SwapIcon } from "@/components/swap-icon";
import { useJustAdded } from "@/hooks/use-just-added";
import { Button, buttonStyles } from "@repo/ui";

type PickerRowProps = {
  product: Product;
  basketName: string;
  onAdd: (quantity: number) => void;
};

function PickerRow({ product, basketName, onAdd }: PickerRowProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, triggerAdded] = useJustAdded();

  return (
    <li className="flex items-center gap-4 rounded-card border border-border bg-background p-3">
      <img
        src={product.images[0]}
        alt={product.name}
        className="size-16 shrink-0 rounded-input object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-sm font-semibold tracking-tight text-gunmetal">
          {product.name}
        </p>

        <p className="mt-0.5 text-sm text-pine/70">{product.price}</p>
      </div>

      <div
        role="group"
        aria-label={`Quantidade de ${product.name}`}
        className="flex shrink-0 items-center gap-1 rounded-button border border-input p-0.5"
      >
        <Button
          iconOnly
          tone="muted"
          iconSize="sm"
          label="Diminuir quantidade"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          disabled={quantity === 1}
          className="disabled:cursor-not-allowed disabled:opacity-40"
          icon={<Minus size={14} weight="bold" />}
        />

        <span className="w-7 text-center text-sm font-semibold text-gunmetal">
          {quantity}
        </span>

        <Button
          iconOnly
          tone="muted"
          iconSize="sm"
          label="Aumentar quantidade"
          onClick={() => setQuantity((current) => current + 1)}
          icon={<Plus size={14} weight="bold" />}
        />
      </div>

      <Button
        iconOnly
        tone="muted"
        iconSize="md"
        label={
          justAdded
            ? `${product.name} adicionado à cesta ${basketName}`
            : `Adicionar ${product.name} à cesta ${basketName}`
        }
        onClick={() => {
          onAdd(quantity);
          setQuantity(1);
          triggerAdded();
        }}
        className="relative shrink-0 border border-border hover:border-jungle hover:text-jungle hover:bg-transparent"
        icon={
          <SwapIcon
            active={justAdded}
            icon={<Plus size={15} weight="bold" />}
            activeIcon={<Check size={15} weight="bold" />}
          />
        }
      >
        {justAdded && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-pulse-once rounded-full bg-jungle/25"
          />
        )}
      </Button>
    </li>
  );
}

export default function CestaPage() {
  const {
    addItem,
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
  const { addBasket } = useCart();
  const [sent, setSent] = useState<Order | null>(null);
  const [justAddedBasket, triggerBasketAdded] = useJustAdded();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const cancelRename = useRef(false);

  const active = baskets.find((basket) => basket.id === activeId) ?? baskets[0];
  const atMax = baskets.length >= MAX_BASKETS;

  if (!active) {
    return null;
  }

  function sendRequest() {
    setSent(sendActiveBasket());
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
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        {sent !== null ? (
          <Confirmation
            number={sent.number}
            basketName={sent.name}
            onBack={() => setSent(null)}
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
                Gerencie suas cestas e faça um pedido por vez — o Mix Bazar
                confirma tudo pelo atendimento.
              </p>
            </section>

            <div className="pb-8">
              <div
                role="group"
                aria-label="Escolher cesta"
                className="flex gap-2 overflow-x-auto scroll-slim"
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
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-button border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-jungle bg-jungle/10 text-jungle"
                          : "border-border bg-background text-pine hover:border-jungle hover:text-jungle"
                      }`}
                    >
                      {basket.name}
                      <span
                        className={
                          isActive
                            ? "text-xs text-jungle/70"
                            : "text-xs text-pine/60"
                        }
                      >
                        · {basketCount}{" "}
                        {basketCount === 1 ? "item" : "itens"}
                      </span>
                    </button>
                  );
                })}

                <Button
                  variant="outline"
                  size="xs"
                  icon={<Plus size={15} weight="bold" />}
                  aria-label="Criar nova cesta"
                  title={atMax ? "Limite de 5 cestas atingido" : undefined}
                  disabled={atMax}
                  onClick={createBasket}
                  className="shrink-0 text-pine hover:border-jungle hover:text-jungle hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Nova cesta
                </Button>
              </div>

              {atMax && (
                <p aria-live="polite" className="pt-3 text-xs text-pine/70">
                  Limite de 5 cestas atingido — exclua uma para criar outra.
                </p>
              )}
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
                <Button
                  iconOnly
                  tone="ghost"
                  iconSize="md"
                  label={`Renomear cesta ${active.name}`}
                  onClick={startRename}
                  icon={<PencilLine size={18} />}
                />

                <Button
                  iconOnly
                  tone="ghost"
                  iconSize="md"
                  label={`Excluir cesta ${active.name}`}
                  title={
                    baskets.length === 1
                      ? "Mantenha ao menos uma cesta"
                      : undefined
                  }
                  disabled={baskets.length === 1}
                  onClick={() => deleteBasket(active.id)}
                  className="disabled:cursor-not-allowed disabled:opacity-40"
                  icon={<Trash size={18} />}
                />
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
                    Adicione produtos logo abaixo ou escolha outra cesta
                    acima.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      document
                        .getElementById("adicionar-produtos")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  >
                    Ver produtos abaixo
                    <ArrowDown size={17} />
                  </Button>

                    <Link
                      href="/catalogo"
                      className={buttonStyles({ variant: "outline", size: "sm" })}
                    >
                      Ver catálogo
                      <ArrowRight size={17} />
                    </Link>
                  </div>
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
                          <Button
                            iconOnly
                            tone="muted"
                            iconSize="sm"
                            label="Diminuir quantidade"
                            onClick={() =>
                              setQuantity(
                                item.product.id,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity === 1}
                            className="disabled:cursor-not-allowed disabled:opacity-40"
                            icon={<Minus size={14} weight="bold" />}
                          />

                            <span className="w-7 text-center text-sm font-semibold text-gunmetal">
                              {item.quantity}
                            </span>

                            <Button
                              iconOnly
                              tone="muted"
                              iconSize="sm"
                              label="Aumentar quantidade"
                              onClick={() =>
                                setQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              icon={<Plus size={14} weight="bold" />}
                            />
                          </div>

                          <span className="font-heading text-base font-semibold text-gunmetal">
                            {formatPrice(
                              item.product.priceValue * item.quantity,
                            )}
                          </span>
                        </div>
                      </div>

                      <Button
                        iconOnly
                        tone="ghost"
                        iconSize="md"
                        label={`Remover ${item.product.name} da cesta`}
                        onClick={() => removeItem(item.product.id)}
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
                    O Mix Bazar confirma seu pedido pelo atendimento antes
                    de separar os produtos.
                  </p>

                  <Button
                    variant="primary"
                    size="xl"
                    onClick={sendRequest}
                    className="mt-5 w-full"
                  >
                    Fazer pedido
                    <ArrowRight size={17} />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    icon={
                      <SwapIcon
                        active={justAddedBasket}
                        icon={<ShoppingCart size={17} />}
                        activeIcon={<Check size={17} weight="bold" />}
                      />
                    }
                    onClick={() => {
                      addBasket(active);
                      triggerBasketAdded();
                    }}
                    className="relative mt-3 w-full"
                  >
                    Adicionar cesta ao carrinho
                    {justAddedBasket && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 animate-pulse-once rounded-button bg-jungle/25"
                      />
                    )}
                  </Button>

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
            )}
          </>
        )}

        <section
          id="adicionar-produtos"
          className="scroll-mt-24 border-t border-border py-20 md:py-24"
        >
          <SectionHeader
            eyebrow="Monte sua cesta"
            title="Adicionar produtos"
            description={`Escolha a quantidade e adicione à cesta ${active.name}.`}
          />

          <ul
            aria-label={`Produtos para a cesta ${active.name}`}
            className="mt-10 grid gap-3 sm:grid-cols-2"
          >
            {products.map((product) => (
              <PickerRow
                key={product.id}
                product={product}
                basketName={active.name}
                onAdd={(quantity) => addItem(product, quantity)}
              />
            ))}
          </ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

function Confirmation({
  number,
  basketName,
  onBack,
}: {
  number: number;
  basketName: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center md:py-24">
      <CheckCircle size={64} weight="duotone" className="text-jungle" />

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
        Pedido enviado
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-pine/70 md:text-base">
        Sua cesta “{basketName}” foi enviada como o pedido #{number}. O Mix
        Bazar vai confirmar tudo pelo atendimento.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/catalogo"
          className={buttonStyles({ variant: "primary", size: "lg" })}
        >
          Voltar ao catálogo
          <ArrowRight size={17} />
        </Link>

        <Button variant="outline" size="lg" onClick={onBack}>
          Ver minhas cestas
        </Button>

        <Link
          href="/pedidos"
          className={buttonStyles({ variant: "outline", size: "lg" })}
        >
          Ver meus pedidos
        </Link>
      </div>
    </div>
  );
}
