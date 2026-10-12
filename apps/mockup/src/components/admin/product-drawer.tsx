"use client";

import { CaretDown, FolderSimple, Image as ImageIcon, X } from "@phosphor-icons/react/dist/ssr";
import { Field, FormGrid } from "@/components/admin-form";
import { CoverField } from "@/components/admin/cover-field";
import { categories as catalogCategories } from "@/data/catalog";
import {
  Input,
  Label,
  ResponsivePopover,
  ResponsivePopoverBody,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@repo/ui";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";
import { useState } from "react";

export type ProductDraft = {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  badge: string;
  description: string;
  images: string[];
  active: boolean;
};

function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const meta = catalogCategories.find((entry) => entry.name === value);
  const TriggerIcon = meta?.icon ?? FolderSimple;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label="Categoria">
        {meta && (
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-input ${meta.tint}`}
          >
            <TriggerIcon size={14} />
          </span>
        )}
        <SelectValue placeholder="Escolha a categoria" />
      </SelectTrigger>
      <SelectContent>
        {catalogCategories.map((category) => {
          const OptionIcon = category.icon;
          return (
            <SelectItem key={category.name} value={category.name}>
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-input ${category.tint}`}
              >
                <OptionIcon size={14} />
              </span>
              <SelectItemText>{category.name}</SelectItemText>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function ProductDrawer({
  open,
  editing,
  draft,
  onDraft,
  canSave,
  priceError,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: boolean;
  draft: ProductDraft;
  onDraft: (patch: Partial<ProductDraft>) => void;
  canSave: boolean;
  priceError: string | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [imagePicker, setImagePicker] = useState<{
    anchor: Element;
  } | null>(null);

  function appendImage(url: string) {
    if (url.trim() === "") return;
    onDraft({ images: [...draft.images, url.trim()] });
  }

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
              {editing ? "Editar produto" : "Novo produto"}
            </SheetTitle>
          </SheetHeader>

          <FormGrid className="min-h-0 flex-1 content-start overflow-y-auto px-6 py-4">
            <Field span={12}>
              <div className="grid gap-2">
                <Label htmlFor="product-name">Nome</Label>
                <Input
                  id="product-name"
                  value={draft.name}
                  onChange={(event) => onDraft({ name: event.target.value })}
                  placeholder="Ex. Cesta Café da Manhã"
                  autoFocus
                />
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
                <Label htmlFor="product-category">Categoria</Label>
                <CategorySelect
                  value={draft.category}
                  onChange={(next) => onDraft({ category: next })}
                />
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
                <Label htmlFor="product-price">Preço (R$)</Label>
                <Input
                  id="product-price"
                  value={draft.price}
                  onChange={(event) => onDraft({ price: event.target.value })}
                  placeholder="97,90"
                  inputMode="decimal"
                />
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
                <Label htmlFor="product-old-price">Preço antigo (R$)</Label>
                <Input
                  id="product-old-price"
                  value={draft.oldPrice}
                  onChange={(event) =>
                    onDraft({ oldPrice: event.target.value })
                  }
                  placeholder="Opcional"
                  inputMode="decimal"
                />
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
                <Label htmlFor="product-badge">Selo</Label>
                <Input
                  id="product-badge"
                  value={draft.badge}
                  onChange={(event) => onDraft({ badge: event.target.value })}
                  placeholder="Ex. Novo"
                />
              </div>
            </Field>
            <Field span={12}>
              <div className="grid gap-2">
                <Label htmlFor="product-description">Descrição</Label>
                <Textarea
                  id="product-description"
                  value={draft.description}
                  onChange={(event) =>
                    onDraft({ description: event.target.value })
                  }
                  placeholder="Descreva o produto"
                  rows={3}
                />
              </div>
            </Field>
            <Field span={12}>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Imagens</span>
                {draft.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {draft.images.map((src) => (
                      <span key={src} className="relative shrink-0">
                        <img
                          src={src}
                          alt=""
                          className="h-16 w-16 rounded-input bg-platinum object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onDraft({
                              images: draft.images.filter(
                                (entry) => entry !== src,
                              ),
                            })
                          }
                          aria-label="Remover imagem"
                          className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-gunmetal/70 text-platinum transition hover:bg-gunmetal"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={(event) =>
                    setImagePicker({ anchor: event.currentTarget })
                  }
                  aria-haspopup="dialog"
                  className="flex items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
                >
                  <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-input bg-platinum text-pine/50">
                    <ImageIcon size={18} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                    Adicionar imagem
                  </span>
                  <CaretDown size={16} className="shrink-0 text-pine/60" />
                </button>
              </div>
            </Field>
            <Field span={12}>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="product-active">Visível na loja</Label>
                <Switch
                  id="product-active"
                  checked={draft.active}
                  onCheckedChange={(next) => onDraft({ active: next })}
                />
              </div>
            </Field>
            {priceError !== null && (
              <Field span={12}>
                <p role="alert" className="text-xs font-medium text-danger-text">
                  {priceError}
                </p>
              </Field>
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
          aria-label="Adicionar imagem"
          className="sm:w-80"
        >
          <ResponsivePopoverHeader>
            <ResponsivePopoverTitle>Imagem</ResponsivePopoverTitle>
          </ResponsivePopoverHeader>
              <ResponsivePopoverBody>
                <CoverField
                  fieldId="product-image"
                  label="Nova imagem"
                  mode="append"
                  value=""
                  onChange={appendImage}
                />
              </ResponsivePopoverBody>
        </ResponsivePopoverContent>
      </ResponsivePopover>
    </>
  );
}
