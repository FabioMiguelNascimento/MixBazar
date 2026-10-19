"use client";

import { useState } from "react";
import { CaretDown, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { Field, FormGrid } from "@/components/admin-form";
import { CoverField } from "@/components/admin/cover-field";
import {
  Input,
  Label,
  ResponsivePopover,
  ResponsivePopoverBody,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  Switch,
} from "@repo/ui";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";

export type BannerDraft = {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: string;
  active: boolean;
};

export function BannerDrawer({
  open,
  editing,
  draft,
  onDraft,
  canSave,
  titleError,
  positionError,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: boolean;
  draft: BannerDraft;
  onDraft: (patch: Partial<BannerDraft>) => void;
  canSave: boolean;
  titleError: string | null;
  positionError: string | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [imagePicker, setImagePicker] = useState<{
    anchor: Element;
  } | null>(null);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            onClose();
            setImagePicker(null);
          }
        }}
      >
        <SheetContent aria-describedby={undefined} className="p-0">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
            <SheetTitle>
              {editing ? "Editar banner" : "Novo banner"}
            </SheetTitle>
          </SheetHeader>

          <FormGrid className="min-h-0 flex-1 content-start overflow-y-auto px-6 py-4">
            <Field span={12}>
              <div className="grid gap-2">
                <Label htmlFor="banner-title">Título</Label>
                <Input
                  id="banner-title"
                  value={draft.title}
                  onChange={(event) => onDraft({ title: event.target.value })}
                  placeholder="Ex. Dia dos Pais"
                  autoFocus
                />
              </div>
            </Field>
            <Field span={12}>
              <div className="grid gap-2">
                <Label htmlFor="banner-subtitle">Subtítulo</Label>
                <Input
                  id="banner-subtitle"
                  value={draft.subtitle}
                  onChange={(event) =>
                    onDraft({ subtitle: event.target.value })
                  }
                  placeholder="Ex. Cestas a partir de R$ 79,90"
                />
              </div>
            </Field>
            <Field span={12}>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Imagem</span>
                <button
                  type="button"
                  onClick={(event) =>
                    setImagePicker({ anchor: event.currentTarget })
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
            <Field span={6}>
              <div className="grid gap-2">
                <Label htmlFor="banner-link">Destino</Label>
                <Input
                  id="banner-link"
                  value={draft.link}
                  onChange={(event) => onDraft({ link: event.target.value })}
                  placeholder="Ex. /catalogo"
                  inputMode="url"
                />
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
                <Label htmlFor="banner-position">Posição</Label>
                <Input
                  id="banner-position"
                  value={draft.position}
                  onChange={(event) =>
                    onDraft({ position: event.target.value })
                  }
                  placeholder="Ex. 1"
                  inputMode="numeric"
                />
              </div>
            </Field>
            <Field span={12}>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="banner-active">Visível na vitrine</Label>
                <Switch
                  id="banner-active"
                  checked={draft.active}
                  onCheckedChange={(next) => onDraft({ active: next })}
                />
              </div>
            </Field>
            {[titleError, positionError].map(
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

      <ResponsivePopover
        open={imagePicker !== null}
        modal
        onOpenChange={(next) => {
          if (!next) setImagePicker(null);
        }}
        anchorEl={imagePicker?.anchor ?? null}
      >
        <ResponsivePopoverContent
          aria-label="Imagem do banner"
          className="sm:w-80"
        >
          <ResponsivePopoverHeader>
            <ResponsivePopoverTitle>Imagem</ResponsivePopoverTitle>
          </ResponsivePopoverHeader>
          <ResponsivePopoverBody>
            <CoverField
              fieldId="banner-image"
              label="Imagem"
              value={draft.image}
              onChange={(next) => onDraft({ image: next })}
            />
          </ResponsivePopoverBody>
        </ResponsivePopoverContent>
      </ResponsivePopover>
    </>
  );
}
