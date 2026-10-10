"use client";

import {
  CaretRight,
  Clock,
  Package,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatDateTime, formatPrice, useBasket } from "@/context/basket";
import { buttonStyles } from "@repo/ui";

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useBasket();
  const order = orders.find((item) => item.id === id);

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/pedidos" />

      <div className="mx-auto max-w-7xl px-6">
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
                Pedido #{order.number} — {order.name}
              </h1>

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
                {order.items.map((item) => (
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
                        Qtd. {item.quantity} · {item.product.price} cada
                      </p>
                    </div>

                    <span className="ml-auto shrink-0 font-heading text-base font-semibold text-gunmetal">
                      {formatPrice(item.product.priceValue * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

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

                  <div className="flex items-center justify-between gap-4 border-t border-gunmetal/10 pt-3">
                    <dt className="font-heading text-base font-semibold text-gunmetal">
                      Total
                    </dt>
                    <dd className="font-heading text-base font-semibold text-gunmetal">
                      {formatPrice(order.subtotal)}
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
