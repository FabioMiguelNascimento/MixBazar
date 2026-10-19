"use client";

import {
  CaretDown,
  FolderSimple,
  Image as ImageIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Field, FormGrid } from "@/components/admin-form";
import { Input, Label, Switch } from "@repo/ui";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";
import {
  ICONS,
  TINTS,
  type PickerId,
} from "@/components/admin/category-model";

export type CategoryDraft = {
  name: string;
  active: boolean;
  icon: string;
  tint: string;
  image: string;
};

export function CategoryDrawer({
  open,
  editing,
  draft,
  onDraft,
  canSave,
  onClose,
  onSave,
  onOpenPicker,
}: {
  open: boolean;
  editing: boolean;
  draft: CategoryDraft;
  onDraft: (patch: Partial<CategoryDraft>) => void;
  canSave: boolean;
  onClose: () => void;
  onSave: () => void;
  onOpenPicker: (id: PickerId, anchor: Element) => void;
}) {
  const SelectedIcon = ICONS[draft.icon] ?? FolderSimple;
  const selectedTintLabel =
    TINTS.find((option) => option.value === draft.tint)?.label ?? "Cor";

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
            {editing ? "Editar categoria" : "Nova categoria"}
          </SheetTitle>
        </SheetHeader>

        <FormGrid className="min-h-0 flex-1 content-start overflow-y-auto px-6 py-4">
          <Field span={12}>
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nome</Label>
              <Input
                id="category-name"
                value={draft.name}
                onChange={(event) => onDraft({ name: event.target.value })}
                placeholder="Ex. Aniversário"
                autoFocus
              />
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Ícone</span>
              <button
                type="button"
                onClick={(event) =>
                  onOpenPicker("icon", event.currentTarget)
                }
                aria-haspopup="dialog"
                className="flex min-h-14 items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-input ${draft.tint}`}
                >
                  <SelectedIcon size={18} />
                </span>
                <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                  Trocar ícone
                </span>
                <CaretDown size={16} className="shrink-0 text-pine/60" />
              </button>
            </div>
          </Field>
          <Field span={6}>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Cor</span>
              <button
                type="button"
                onClick={(event) =>
                  onOpenPicker("tint", event.currentTarget)
                }
                aria-haspopup="dialog"
                className="flex min-h-14 items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 rounded-full ${draft.tint}`}
                />
                <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                  {selectedTintLabel}
                </span>
                <CaretDown size={16} className="shrink-0 text-pine/60" />
              </button>
            </div>
          </Field>
          <Field span={12}>
            <div className="grid gap-2">
              <span className="text-sm font-medium">Capa</span>
              <button
                type="button"
                onClick={(event) =>
                  onOpenPicker("cover", event.currentTarget)
                }
                aria-haspopup="dialog"
                className="flex items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
              >
                {draft.image.trim() !== "" ? (
                  <img
                    src={draft.image}
                    alt=""
                    className="h-9 w-14 shrink-0 rounded-input bg-platinum object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-input bg-platinum text-pine/50">
                    <ImageIcon size={18} />
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                  {draft.image.trim() !== ""
                    ? "Trocar imagem"
                    : "Enviar ou colar URL"}
                </span>
                <CaretDown size={16} className="shrink-0 text-pine/60" />
              </button>
            </div>
          </Field>
          <Field span={12}>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="category-active">Visível na loja</Label>
              <Switch
                id="category-active"
                checked={draft.active}
                onCheckedChange={(next) => onDraft({ active: next })}
              />
            </div>
          </Field>
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
