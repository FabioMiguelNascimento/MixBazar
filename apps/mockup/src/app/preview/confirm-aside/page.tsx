"use client";

import { ArrowRight, Tag } from "@phosphor-icons/react/dist/ssr";
import { BasketRecap } from "@/components/basket-recap";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/context/basket";
import { Button } from "@repo/ui";
import {
  sampleAddress,
  sampleComplements,
  sampleCoupon,
  sampleDiscount,
  sampleItems,
  sampleSubtotal,
  sampleTotal,
} from "../order-sample";

export default function PreviewConfirmAsidePage() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        <div className="pb-10 pt-12 md:pb-12 md:pt-16">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
            Confirme seu pedido
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
            Tudo certo? O Mix Bazar confirma pelo atendimento.
          </p>
        </div>

        <div className="grid gap-10 pb-20 md:pb-24 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <BasketRecap
              lines={[
                {
                  kind: "basket",
                  basket: {
                    id: "preview",
                    name: "Minha cesta",
                    items: sampleItems,
                    complements: sampleComplements,
                  },
                  quantity: 1,
                },
              ]}
            />

            <div className="mt-4 rounded-card border border-border bg-background px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                    Entrega
                  </p>

                  <p className="mt-2 text-sm leading-6 text-pine">
                    {sampleAddress}
                  </p>
                </div>

                <button
                  type="button"
                  className="shrink-0 text-sm font-medium text-jungle transition hover:text-pine"
                >
                  Alterar
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-card border border-border bg-background px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-gunmetal">
                  Cupom {sampleCoupon.code}
                  <span className="text-pine/70">
                    {" "}
                    · {sampleCoupon.description}
                  </span>
                </p>

                <button
                  type="button"
                  className="shrink-0 text-sm font-medium text-jungle transition hover:text-pine"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-card bg-platinum p-6 md:p-7 lg:sticky lg:top-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-gunmetal">
              Resumo
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pine">Subtotal</dt>
                <dd className="font-medium text-gunmetal">
                  {formatPrice(sampleSubtotal)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-2 text-pine">
                  <span>Cupom</span>

                  <Tag
                    size={14}
                    weight="bold"
                    className="shrink-0 text-pine/60"
                  />

                  <span className="font-semibold text-gunmetal">
                    {sampleCoupon.code}
                  </span>
                </dt>
                <dd className="font-medium text-jungle">
                  -{formatPrice(sampleDiscount)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-gunmetal/10 pt-3">
                <dt className="font-heading text-base font-semibold text-gunmetal">
                  Total
                </dt>
                <dd className="font-heading text-base font-semibold text-gunmetal">
                  {formatPrice(sampleTotal)}
                </dd>
              </div>
            </dl>

            <Button
              variant="primary"
              size="xl"
              className="mt-5 w-full"
            >
              Confirmar pedido
              <ArrowRight size={17} />
            </Button>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
