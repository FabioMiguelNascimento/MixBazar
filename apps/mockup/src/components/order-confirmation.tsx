"use client";

import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button, buttonStyles } from "@repo/ui";

export function Confirmation({
  number,
  onBack,
}: {
  number: number;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center md:py-24">
      <CheckCircle size={64} weight="duotone" className="text-jungle" />

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
        Pedido enviado
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-pine/70 md:text-base">
        Seu pedido #{number} foi enviado. O Mix Bazar vai confirmar tudo pelo
        atendimento.
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
