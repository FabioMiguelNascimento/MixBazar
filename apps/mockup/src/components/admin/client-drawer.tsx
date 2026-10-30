"use client";

import { useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import {
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  tones,
} from "@repo/ui";
import { Field, FormGrid } from "@/components/admin-form";
import { formatBRL } from "@/components/admin/product-model";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, orderDate, orderTimeLabel, type AdminOrder } from "@/data/admin";
import { clientKey, type Client } from "@/data/clients";

export function ClientDetailDrawer({
  client,
  orders,
  onClose,
}: {
  client: Client | null;
  orders: AdminOrder[];
  onClose: () => void;
}) {
  const history =
    client === null
      ? []
      : orders.filter(
          (order) => clientKey(order.customer) === clientKey(client.name),
        );
  const total = history.reduce((memo, order) => memo + order.total, 0);
  const last =
    history.length === 0
      ? null
      : history.reduce((a, b) => (a.daysAgo <= b.daysAgo ? a : b));

  return (
    <Sheet
      open={client !== null}
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
          <SheetTitle>{client ? client.name : "Cliente"}</SheetTitle>
        </SheetHeader>

        {client !== null && (
          <>
            <div className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto px-6 py-4">
              <dl className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-pine">E-mail</dt>
                  <dd className="truncate font-medium text-gunmetal">
                    {client.email}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-pine">Telefone</dt>
                  <dd className="font-medium text-gunmetal">{client.phone}</dd>
                </div>
                <div className="grid gap-1.5 rounded-card border border-border bg-background px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-pine">
                    Endereço
                  </dt>
                  <dd className="text-sm leading-6 text-gunmetal">
                    {client.address ?? "Sem endereço no cadastro"}
                  </dd>
                </div>
              </dl>

              <div className="grid gap-4 rounded-card border border-border bg-background px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-pine">
                    Histórico do cliente
                  </span>
                  {last !== null && (
                    <span className="text-xs text-pine/70">
                      último pedido {orderTimeLabel(last.daysAgo)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1">
                    <span className="text-xs text-pine/70">Pedidos</span>
                    <span className="font-heading text-lg font-semibold text-gunmetal">
                      {history.length}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-xs text-pine/70">Total</span>
                    <span className="font-heading text-lg font-semibold text-gunmetal">
                      {formatBRL(total)}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-xs text-pine/70">Ticket</span>
                    <span className="font-heading text-lg font-semibold text-gunmetal">
                      {history.length > 0 ? formatBRL(total / history.length) : "—"}
                    </span>
                  </div>
                </div>

                {[...history]
                  .sort((a, b) => a.daysAgo - b.daysAgo)
                  .map((order) => {
                    const meta = orderDate(order.daysAgo);

                    return (
                      <div
                        key={order.id}
                        data-helper="admin-cliente-pedido"
                        className="flex items-center gap-3 border-t border-border pt-3 first:border-0 first:pt-0"
                      >
                        <span className="font-heading text-sm font-semibold text-gunmetal">
                          #{order.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs text-pine/70">
                            {meta.date} · {order.summary}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[ORDER_STATUS_TONE[order.status]]}`}
                        >
                          {ORDER_STATUS_LABEL[order.status]}
                        </span>
                        <span className="shrink-0 font-heading text-sm font-semibold text-gunmetal">
                          {formatBRL(order.total)}
                        </span>
                      </div>
                    );
                  })}

                {history.length === 0 && (
                  <p className="text-sm text-pine/70 border-t border-border pt-3">
                    Nenhum pedido registrado para este cliente.
                  </p>
                )}
              </div>
            </div>

            <SheetFooter className="shrink-0 flex-row justify-end border-t border-border px-6 py-4">
              <a
                href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
              >
                <WhatsappLogo size={16} />
                Falar no WhatsApp
              </a>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

type NewClientDraft = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const EMPTY: NewClientDraft = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export function NewClientDrawer({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draft: Omit<Client, "id">) => void;
}) {
  const [draft, setDraft] = useState<NewClientDraft>(EMPTY);
  const canSave = draft.name.trim() !== "" && draft.email.trim() !== "";

  return (
    <Sheet
      open={open}
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
          <SheetTitle>Novo cliente</SheetTitle>
        </SheetHeader>

        <FormGrid className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <Field span={12}>
            <div className="grid gap-2">
              <Label htmlFor="client-name">Nome</Label>
              <Input
                id="client-name"
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                placeholder="Ex. Mariana Lopes"
                autoFocus
              />
            </div>
          </Field>
          <Field span={12}>
            <div className="grid gap-2">
              <Label htmlFor="client-email">E-mail</Label>
              <Input
                id="client-email"
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
                placeholder="cliente@example.com"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="client-phone">Telefone</Label>
              <Input
                id="client-phone"
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
                placeholder="(51) 99000-0000"
                inputMode="tel"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="client-address">Endereço</Label>
              <Input
                id="client-address"
                value={draft.address}
                onChange={(event) =>
                  setDraft({ ...draft, address: event.target.value })
                }
                placeholder="Rua, número — bairro"
              />
            </div>
          </Field>
        </FormGrid>

        <SheetFooter className="shrink-0 flex-row justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => setDraft(EMPTY)}
            className="inline-flex items-center gap-1.5 rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
          >
            Limpar
          </button>
          <button
            type="button"
            data-helper="admin-cliente-salvar"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onSave({
                name: draft.name.trim(),
                email: draft.email.trim(),
                phone: draft.phone.trim(),
                address: draft.address.trim() === "" ? null : draft.address.trim(),
              });
              setDraft(EMPTY);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cadastrar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
