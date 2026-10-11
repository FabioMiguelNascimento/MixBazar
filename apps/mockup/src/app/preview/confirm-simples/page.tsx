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

export default function PreviewConfirmSimplesPage() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        <div className="mx-auto w-full max-w-3xl pb-20 pt-12 md:pb-24 md:pt-16">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
            Confirme seu pedido
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
            Tudo certo? O Mix Bazar confirma pelo atendimento.
          </p>

          <div className="mt-8">
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
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Entrega
              </p>

              <p className="mt-1 text-sm text-pine">{sampleAddress}</p>
            </div>

            <button
              type="button"
              className="shrink-0 text-sm font-medium text-jungle transition hover:text-pine"
            >
              Alterar
            </button>
          </div>

          <button
            type="button"
            className="mt-4 text-sm font-medium text-jungle transition hover:text-pine"
          >
            Tenho um cupom
          </button>

          <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-pine">Subtotal</span>

              <span className="font-medium text-gunmetal">
                {formatPrice(sampleSubtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="text-pine">Cupom</span>

                <Tag
                  size={14}
                  weight="bold"
                  className="shrink-0 text-pine/60"
                />

                <span className="font-semibold text-gunmetal">
                  {sampleCoupon.code}
                </span>
              </span>

              <span className="font-medium text-jungle">
                -{formatPrice(sampleDiscount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-heading text-base font-semibold text-gunmetal">
                Total
              </span>

              <span className="font-heading text-base font-semibold text-gunmetal">
                {formatPrice(sampleTotal)}
              </span>
            </div>
          </div>

          <Button variant="primary" size="xl" className="mt-8 w-full">
            Confirmar pedido · {formatPrice(sampleTotal)}
            <ArrowRight size={17} />
          </Button>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
