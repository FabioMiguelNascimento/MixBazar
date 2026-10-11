"use client";

import {
  CaretRight,
  Clock,
  Package,
  Tag,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatDateTime, formatPrice, useBasket } from "@/context/basket";
import { complementGroups, coupons } from "@/data/catalog";
import { buttonStyles } from "@repo/ui";

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useBasket();
  const order = orders.find((item) => item.id === id);

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/pedidos" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        {!order ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Package size={56} weight="duotone" className="text-pine" />

            <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
              Pedido não encontrado
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
              O pedido que você procura não existe ou ainda não foi enviado.
            </p>

            <Link
              href="/pedidos"
              className={buttonStyles({
                variant: "outline",
                size: "md",
                className: "mt-7",
              })}
            >
              Ver meus pedidos
            </Link>
          </div>
        ) : (
          <>
            <nav
              aria-label="Trilha de navegação"
              className="flex flex-wrap items-center gap-1.5 py-5 text-sm text-pine"
            >
              <Link href="/pedidos" className="transition hover:text-jungle">
                Pedidos
              </Link>
              <CaretRight size={13} weight="bold" className="text-pine/40" />
              <span className="text-gunmetal">Pedido #{order.number}</span>
            </nav>

            <section className="pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Acompanhamento
              </p>

              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                Pedido #{order.number}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
                {order.count} {order.count === 1 ? "item" : "itens"}
                {order.lines.some((line) => line.kind === "basket") && (
                  <>
                    {" "}·{" "}
                    {
                      order.lines.filter(
                        (line) => line.kind === "basket",
                      ).length
                    }{" "}
                    {order.lines.filter((line) => line.kind === "basket")
                      .length === 1
                      ? "cesta"
                      : "cestas"}
                  </>
                )}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-button bg-jungle/10 px-3 py-1.5 text-xs font-semibold text-jungle">
                  <Clock size={12} />
                  Aguardando confirmação
                </span>

                <span className="text-sm text-pine/70">
                  Enviado em {formatDateTime(order.sentAt)}
                </span>
              </div>
            </section>

            <div className="grid gap-10 pb-20 md:pb-24 lg:grid-cols-[1fr_360px] lg:gap-12">
              <ul
                aria-label={`Itens do pedido #${order.number}`}
                className="divide-y divide-border"
              >
                {order.lines.map((line, index) =>
                  line.kind === "product" ? (
                    <li
                      key={`product-${line.product.id}-${index}`}
                      className="flex gap-4 py-6 first:pt-0 sm:gap-5"
                    >
                      <Link
                        href={`/produto/${line.product.id}`}
                        className="block size-24 shrink-0 overflow-hidden rounded-input bg-platinum sm:size-28"
                      >
                        <img
                          src={line.product.images[0]}
                          alt={line.product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-xs font-medium text-pine/70">
                          {line.product.category}
                        </p>

                        <Link
                          href={`/produto/${line.product.id}`}
                          className="mt-0.5 font-heading text-base font-semibold tracking-tight text-gunmetal transition hover:text-jungle"
                        >
                          {line.product.name}
                        </Link>

                        <p className="mt-1 text-sm text-pine/70">
                          Qtd. {line.quantity} · {line.product.price} cada
                        </p>
                      </div>

                      <span className="ml-auto shrink-0 font-heading text-base font-semibold text-gunmetal">
                        {formatPrice(
                          line.product.priceValue * line.quantity,
                        )}
                      </span>
                    </li>
                  ) : (
                    <li
                      key={`basket-${line.basket.id}-${index}`}
                      className="py-6 first:pt-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="min-w-0 flex-1 truncate font-heading text-base font-semibold tracking-tight text-gunmetal">
                          {line.basket.name}{" "}
                          <span className="font-medium text-pine/70">
                            × {line.quantity}
                          </span>
                        </p>
                      </div>

                      <ul
                        aria-label={`Itens da cesta ${line.basket.name}`}
                        className="mt-1"
                      >
                        {line.basket.items.map((item) => (
                          <li
                            key={item.product.id}
                            className="flex items-center gap-3 py-2"
                          >
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="size-12 shrink-0 rounded-input object-cover"
                            />

                            <p className="min-w-0 flex-1 truncate text-sm font-medium text-gunmetal">
                              {item.product.name}{" "}
                              <span className="text-pine/70">
                                × {item.quantity}
                              </span>
                            </p>

                            <span className="shrink-0 text-sm font-semibold text-gunmetal">
                              {formatPrice(
                                item.product.priceValue * item.quantity,
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {line.basket.complements.length > 0 && (
                        <ul
                          aria-label="Complementos da cesta"
                          className="ml-3 border-l-2 border-jungle/20 pl-3"
                        >
                          {line.basket.complements.map((complement) => (
                            <li
                              key={complement.option.id}
                              className="flex items-center gap-3 py-1.5"
                            >
                              <p className="min-w-0 flex-1 truncate text-sm font-medium text-gunmetal">
                                {complement.option.name}{" "}
                                <span className="text-pine/70">
                                  ·{" "}
                                  {
                                    complementGroups.find(
                                      (group) =>
                                        group.id === complement.groupId,
                                    )?.name
                                  }
                                </span>
                              </p>

                              <span className="shrink-0 text-sm font-semibold text-gunmetal">
                                {complement.option.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ),
                )}
              </ul>

              <div className="mt-6 border-t border-border pt-6 lg:col-start-1 lg:row-start-2 lg:mt-0">
                <h2 className="font-heading text-base font-semibold tracking-tight text-gunmetal">
                  {order.pickup ? "Retirada" : "Entrega"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-pine">
                  {order.pickup ? "Retirada no local" : order.address}
                </p>
              </div>

              <aside className="h-fit rounded-card bg-platinum p-6 md:p-7 lg:sticky lg:top-24">
                <h2 className="font-heading text-xl font-semibold tracking-tight text-gunmetal">
                  Resumo
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-pine">Itens do pedido</dt>
                    <dd className="font-medium text-gunmetal">
                      {order.count}{" "}
                      {order.count === 1 ? "item" : "itens"}
                    </dd>
                  </div>

                  {order.discount > 0 && (
                    <>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <dt className="text-pine">Subtotal</dt>

                        <dd className="font-medium text-gunmetal">
                          {formatPrice(order.subtotal)}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-4 text-sm">
                        <dt>
                          <span className="flex items-center gap-2">
                            <span className="text-pine">Cupom</span>

                            <Tag
                              size={14}
                              weight="bold"
                              className="shrink-0 text-pine/60"
                            />

                            <span className="font-semibold text-gunmetal">
                              {order.couponCode}
                            </span>
                          </span>

                          <span className="mt-0.5 block text-xs text-pine/70">
                            {
                              coupons.find(
                                (coupon) =>
                                  coupon.code === order.couponCode,
                              )?.description
                            }
                          </span>
                        </dt>

                        <dd className="font-medium text-jungle">
                          -{formatPrice(order.discount)}
                        </dd>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between gap-4 border-t border-gunmetal/10 pt-3">
                    <dt className="font-heading text-base font-semibold text-gunmetal">
                      Total
                    </dt>
                    <dd className="font-heading text-base font-semibold text-gunmetal">
                      {formatPrice(order.subtotal - order.discount)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs leading-5 text-pine/70">
                  O Mix Bazar confirma seu pedido pelo atendimento antes de
                  separar os produtos.
                </p>

                <Link
                  href="/pedidos"
                  className={buttonStyles({
                    variant: "outline",
                    size: "lg",
                    className: "mt-5 w-full",
                  })}
                >
                  Voltar para pedidos
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
