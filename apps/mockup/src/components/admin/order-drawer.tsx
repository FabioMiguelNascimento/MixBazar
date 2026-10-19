"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Tag, Truck } from "@phosphor-icons/react/dist/ssr";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import { tones } from "@repo/ui";
import { products } from "@/data/catalog";
import {
  FUNNEL_STAGES,
  NEXT_STATUS,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  PREV_STATUS,
  orderTimeLabel,
  type AdminOrder,
} from "@/data/admin";
import { formatBRL } from "@/components/admin/product-model";

function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Endereço copiado" : "Copiar endereço"}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          {copied ? "Copiado!" : "Copiar endereço"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function OrderDrawer({
  order,
  onClose,
  onStatus,
}: {
  order: AdminOrder | null;
  onClose: () => void;
  onStatus: (id: string, status: AdminOrder["status"]) => void;
}) {
  return (
    <Sheet
      open={order !== null}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent
        aria-describedby={undefined}
        className="p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
          <SheetTitle>
            {order ? `Pedido #${order.number}` : "Pedido"}
          </SheetTitle>
        </SheetHeader>

        {order && <OrderDetail order={order} onStatus={onStatus} />}
      </SheetContent>
    </Sheet>
  );
}

function OrderDetail({
  order,
  onStatus,
}: {
  order: AdminOrder;
  onStatus: (id: string, status: AdminOrder["status"]) => void;
}) {
  const next = NEXT_STATUS[order.status];
  const prev = PREV_STATUS[order.status];
  const progress =
    (FUNNEL_STAGES.indexOf(order.status) / (FUNNEL_STAGES.length - 1)) * 100;

  return (
    <>
      <div className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[ORDER_STATUS_TONE[order.status]]}`}
          >
            {ORDER_STATUS_LABEL[order.status]}
          </span>
          <span className="text-xs text-pine/70">{orderTimeLabel(order.daysAgo)}</span>
        </div>

        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-pine">Cliente</dt>
            <dd className="truncate font-medium text-gunmetal">
              {order.customer}
            </dd>
          </div>
          <div className="grid gap-2">
            <dt className="text-pine">
              Itens · {order.items.reduce((total, item) => total + item.quantity, 0)}
            </dt>
            <dd className="min-w-0 [&_[data-slot=table-container]]:max-h-[38dvh] [&_[data-slot=table-container]]:overflow-y-auto [&_[data-slot=table-head]]:sticky [&_[data-slot=table-head]]:top-0 [&_[data-slot=table-head]]:z-10 [&_[data-slot=table-head]]:bg-background">
              <Table aria-label="Itens do pedido">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-9 normal-case tracking-normal">
                      Item
                    </TableHead>
                    <TableHead className="h-9 text-center normal-case tracking-normal">
                      Qtd
                    </TableHead>
                    <TableHead className="h-9 text-right normal-case tracking-normal">
                      Valor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => {
                    const meta = products.find(
                      (product) => product.name === item.name,
                    );
                    const unit = item.priceValue ?? meta?.priceValue ?? null;
                    return (
                      <TableRow key={item.name}>
                        <TableCell className="py-2">
                          <span className="flex min-w-0 items-center gap-2.5">
                            {meta?.images[0] ? (
                              <img
                                src={meta.images[0]}
                                alt=""
                                className="size-8 shrink-0 rounded-input bg-platinum object-cover"
                              />
                            ) : (
                              <span className="size-8 shrink-0 rounded-input bg-platinum" />
                            )}
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-gunmetal">
                                {item.name}
                              </span>
                              <span className="block truncate text-xs text-pine/70">
                                {meta?.category ?? "Avulso"}
                              </span>
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <span className="font-heading text-sm font-semibold text-gunmetal">
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <span className="font-heading text-sm font-semibold text-gunmetal">
                            {unit !== null
                              ? formatBRL(unit * item.quantity)
                              : "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-pine">
              <Truck size={14} />
              Modo
            </dt>
            <dd className="font-medium text-gunmetal">
              {order.mode === "entrega" ? "Entrega" : "Retirada"}
            </dd>
          </div>
          {order.address !== null && (
            <div className="grid gap-1.5 rounded-card border border-border bg-background px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-pine">
                Endereço de entrega
              </dt>
              <dd className="flex min-w-0 items-start gap-2">
                <span className="min-w-0 flex-1 text-sm leading-6 text-gunmetal">
                  {order.address}
                </span>
                <CopyAddress value={order.address} />
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-pine">
              <Tag size={14} />
              Cupom
            </dt>
            <dd className="font-medium text-gunmetal">
              {order.couponCode ?? "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
            <dt className="font-medium text-gunmetal">Total</dt>
            <dd className="font-heading text-lg font-semibold text-gunmetal">
              {formatBRL(order.total)}
            </dd>
          </div>
        </dl>

        <ol aria-label="Etapas do pedido" className="relative grid">
          <span
            aria-hidden="true"
            style={{
              background: `linear-gradient(to bottom, var(--jungle) ${progress}%, var(--border) ${progress}%)`,
            }}
            className="absolute bottom-4 left-1 top-4 w-0.5"
          />
          {FUNNEL_STAGES.map((stage, index) => {
            const current = FUNNEL_STAGES.indexOf(order.status);
            const done = index < current;
            const isCurrent = index === current;
            return (
              <li key={stage} className="relative flex min-w-0 items-center gap-3 py-2">
                <span
                  aria-hidden="true"
                  className={`relative z-10 size-2.5 shrink-0 rounded-full ${
                    done || isCurrent ? "bg-jungle" : "bg-border"
                  }`}
                />
                <span
                  className={`text-sm ${isCurrent ? "font-semibold text-gunmetal" : "text-pine/70"}`}
                >
                  {ORDER_STATUS_LABEL[stage]}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <SheetFooter className="shrink-0 flex-row justify-end border-t border-border px-6 py-4">
        {prev && (
          <button
            type="button"
            onClick={() => onStatus(order.id, prev)}
            className="inline-flex items-center gap-1.5 rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
          >
            <ArrowLeft size={16} />
            {ORDER_STATUS_LABEL[prev]}
          </button>
        )}
        {next && (
          <button
            type="button"
            onClick={() => onStatus(order.id, next)}
            data-helper="admin-pedido-avancar"
            className="inline-flex items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
          >
            Avançar
            <ArrowRight size={16} />
          </button>
        )}
      </SheetFooter>
    </>
  );
}
