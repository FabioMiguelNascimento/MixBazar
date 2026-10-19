"use client";

import { Field, FormGrid } from "@/components/admin-form";
import { CampaignProducts } from "@/components/admin/campaign-products";
import { couponCodeError } from "@/components/admin/coupon-model";
import {
  Input,
  Label,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";

export type CampaignDraft = {
  name: string;
  couponCode: string;
  limit: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
  productIds: string[];
};

export function CampaignDrawer({
  open,
  editing,
  draft,
  onDraft,
  canSave,
  nameError,
  codeError,
  limitError,
  datesError,
  codeLocked,
  tab,
  onTab,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: boolean;
  draft: CampaignDraft;
  onDraft: (patch: Partial<CampaignDraft>) => void;
  canSave: boolean;
  nameError: string | null;
  codeError: string | null;
  limitError: string | null;
  datesError: string | null;
  codeLocked: boolean;
  tab: string;
  onTab: (next: string) => void;
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
            {editing ? "Editar campanha" : "Nova campanha"}
          </SheetTitle>
        </SheetHeader>

        <Tabs
          value={tab}
          onValueChange={onTab}
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <TabsList aria-label="Seções da campanha" className="shrink-0">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="min-h-0 flex-1 overflow-y-auto">
        <FormGrid className="content-start px-6 py-4">
          <Field span={12}>
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Nome</Label>
              <Input
                id="campaign-name"
                value={draft.name}
                onChange={(event) => onDraft({ name: event.target.value })}
                placeholder="Ex. Dia dos Pais"
                autoFocus
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="campaign-coupon">Cupom</Label>
              <Input
                id="campaign-coupon"
                value={draft.couponCode}
                onChange={(event) =>
                  onDraft({ couponCode: event.target.value.toUpperCase() })
                }
                placeholder="Ex. PAI15"
                disabled={codeLocked}
                className="font-heading font-semibold tracking-wide"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="campaign-limit">Limite de usos</Label>
              <Input
                id="campaign-limit"
                value={draft.limit}
                onChange={(event) => onDraft({ limit: event.target.value })}
                placeholder="Ex. 150"
                inputMode="numeric"
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="campaign-starts">Início</Label>
              <Input
                id="campaign-starts"
                type="date"
                value={draft.startsAt}
                onChange={(event) => onDraft({ startsAt: event.target.value })}
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <Label htmlFor="campaign-ends">Término</Label>
              <Input
                id="campaign-ends"
                type="date"
                value={draft.endsAt}
                min={draft.startsAt === "" ? undefined : draft.startsAt}
                onChange={(event) => onDraft({ endsAt: event.target.value })}
              />
            </div>
          </Field>
          <Field span={12}>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="campaign-active">Ativa</Label>
              <Switch
                id="campaign-active"
                checked={draft.active}
                onCheckedChange={(next) => onDraft({ active: next })}
              />
            </div>
          </Field>
          {[nameError, codeError, limitError, datesError].map(
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
          </TabsContent>

          <TabsContent
            value="produtos"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <FormGrid className="content-start px-6 py-4">
              <Field span={12}>
                <CampaignProducts
                  value={draft.productIds}
                  onChange={(next) => onDraft({ productIds: next })}
                />
              </Field>
            </FormGrid>
          </TabsContent>
        </Tabs>

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
