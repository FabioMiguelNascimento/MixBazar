"use client";

import { Field, FormGrid } from "@/components/admin-form";
import type { CouponDiscountType } from "@/components/admin/coupon-model";
import { seedCampaigns } from "@/data/admin";
import {
  ButtonGroup,
  Combobox,
  Input,
  Label,
  Switch,
} from "@repo/ui";

function CampaignSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <Combobox
      value={value}
      onChange={onChange}
      ariaLabel="Campanha"
      placeholder="Sem campanha"
      searchPlaceholder="Buscar campanha"
      emptyText="Nenhuma campanha encontrada."
      options={seedCampaigns.map((campaign) => ({
        value: campaign.name,
        label: campaign.name,
        hint: campaign.couponCode,
      }))}
    />
  );
}
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";

export type CouponDraft = {
  code: string;
  campaign: string;
  type: CouponDiscountType;
  amount: string;
  limit: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

export function CouponDrawer({
  open,
  editing,
  draft,
  onDraft,
  canSave,
  codeError,
  amountError,
  limitError,
  datesError,
  codeLocked,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: boolean;
  draft: CouponDraft;
  onDraft: (patch: Partial<CouponDraft>) => void;
  canSave: boolean;
  codeError: string | null;
  amountError: string | null;
  limitError: string | null;
  datesError: string | null;
  codeLocked: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent aria-describedby={undefined} className="p-0">
        <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
          <SheetTitle>
            {editing ? "Editar cupom" : "Novo cupom"}
          </SheetTitle>
        </SheetHeader>

        <FormGrid className="min-h-0 flex-1 content-start overflow-y-auto px-6 py-4">
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="coupon-code">Código</Label>
              <Input
                id="coupon-code"
                value={draft.code}
                onChange={(event) =>
                  onDraft({ code: event.target.value.toUpperCase() })
                }
                placeholder="Ex. MIX10"
                autoFocus
                disabled={codeLocked}
                className="font-heading font-semibold tracking-wide"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="coupon-campaign">Campanha (opcional)</Label>
              <CampaignSelect
                value={draft.campaign}
                onChange={(next) => onDraft({ campaign: next })}
              />
            </div>
          </Field>
          <Field span={12}>
            <div className="grid gap-2">
              <span
                id="coupon-type-label"
                className="text-sm font-medium"
              >
                Tipo de desconto
              </span>
              <ButtonGroup
                aria-labelledby="coupon-type-label"
                orientation="horizontal"
              >
                {(
                  [
                    { value: "percent", label: "Porcentagem" },
                    { value: "value", label: "Valor (R$)" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      onDraft({ type: option.value, amount: "" })
                    }
                    aria-pressed={draft.type === option.value}
                    className={`shrink-0 rounded-button border px-4 py-2 text-sm font-medium transition ${
                      draft.type === option.value
                        ? "border-jungle bg-jungle text-platinum"
                        : "border-border bg-background text-gunmetal hover:border-jungle"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </ButtonGroup>
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="coupon-amount">
                {draft.type === "percent" ? "Porcentagem (%)" : "Valor (R$)"}
              </Label>
              <Input
                id="coupon-amount"
                value={draft.amount}
                onChange={(event) => onDraft({ amount: event.target.value })}
                placeholder={draft.type === "percent" ? "Ex. 10" : "Ex. 5,00"}
                inputMode="decimal"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="coupon-limit">Limite de usos</Label>
              <Input
                id="coupon-limit"
                value={draft.limit}
                onChange={(event) => onDraft({ limit: event.target.value })}
                placeholder="Ex. 100"
                inputMode="numeric"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="coupon-starts">Válido de</Label>
              <Input
                id="coupon-starts"
                type="date"
                value={draft.startsAt}
                onChange={(event) => onDraft({ startsAt: event.target.value })}
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="coupon-ends">Válido até</Label>
              <Input
                id="coupon-ends"
                type="date"
                value={draft.endsAt}
                min={draft.startsAt === "" ? undefined : draft.startsAt}
                onChange={(event) => onDraft({ endsAt: event.target.value })}
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="flex h-full items-end pb-1">
              <div className="flex w-full items-center justify-between gap-4">
                <Label htmlFor="coupon-active">Ativo</Label>
                <Switch
                  id="coupon-active"
                  checked={draft.active}
                  onCheckedChange={(next) => onDraft({ active: next })}
                />
              </div>
            </div>
          </Field>
          {[codeError, amountError, limitError, datesError].map(
            (error, index) =>
              error !== null && (
                <Field key={index} span={12}>
                  <p
                    role="alert"
                    className="text-xs font-medium text-danger-text"
                  >
                    {error}
                  </p>
                </Field>
              ),
          )}
        </FormGrid>

        <SheetFooter className="shrink-0 flex-row justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            data-helper="admin-salvar"
            className="rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
