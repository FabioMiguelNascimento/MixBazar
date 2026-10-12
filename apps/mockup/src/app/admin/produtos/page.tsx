"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { ProductDrawer, type ProductDraft } from "@/components/admin/product-drawer";
import {
  parseBRL,
  productCategories,
  productSlug,
  seedProducts,
  type AdminProduct,
} from "@/components/admin/product-model";
import { ProductTable } from "@/components/admin/product-table";

const EMPTY_DRAFT: ProductDraft = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  badge: "",
  description: "",
  images: [],
  active: true,
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>(seedProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>({
    ...EMPTY_DRAFT,
    category: productCategories[0] ?? "",
  });

  const priceValue = parseBRL(draft.price);
  const oldPriceValue =
    draft.oldPrice.trim() === "" ? null : parseBRL(draft.oldPrice);
  const priceError =
    draft.price.trim() !== "" && priceValue === null
      ? "Informe um preço válido, ex. 97,90."
      : draft.oldPrice.trim() !== "" && oldPriceValue === null
        ? "Informe um preço antigo válido ou limpe o campo."
        : null;
  const canSave =
    draft.name.trim() !== "" &&
    draft.category !== "" &&
    priceValue !== null &&
    priceError === null &&
    draft.images.length > 0;

  function openNew() {
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT, category: productCategories[0] ?? "" });
    setDialogOpen(true);
  }

  function openEdit(item: AdminProduct) {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      category: item.category,
      price: item.priceValue.toFixed(2).replace(".", ","),
      oldPrice:
        item.oldPriceValue === null
          ? ""
          : item.oldPriceValue.toFixed(2).replace(".", ","),
      badge: item.badge ?? "",
      description: item.description,
      images: item.images,
      active: item.active,
    });
    setDialogOpen(true);
  }

  function save() {
    if (!canSave || priceValue === null) return;
    if (editingId === null) {
      const id = productSlug(
        draft.name,
        new Set(items.map((item) => item.id)),
      );
      setItems([
        ...items,
        {
          id,
          name: draft.name.trim(),
          category: draft.category,
          priceValue,
          oldPriceValue,
          badge: draft.badge.trim() === "" ? null : draft.badge.trim(),
          description: draft.description.trim(),
          images: draft.images,
          active: draft.active,
        },
      ]);
    } else {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: draft.name.trim(),
                category: draft.category,
                priceValue,
                oldPriceValue,
                badge:
                  draft.badge.trim() === "" ? null : draft.badge.trim(),
                description: draft.description.trim(),
                images: draft.images,
                active: draft.active,
              }
            : item,
        ),
      );
    }
    setDialogOpen(false);
  }

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  }

  return (
    <AdminShell active="Produtos" title="Produtos">
      <AdminPageHeader
        actions={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
          >
            <Plus size={16} weight="bold" />
            Novo produto
          </button>
        }
      />

      <div className="mt-10 min-w-0">
        <ProductTable
          items={items}
          onEdit={openEdit}
          onToggle={toggleActive}
          onDelete={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
        />
      </div>

      <ProductDrawer
        open={dialogOpen}
        editing={editingId !== null}
        draft={draft}
        onDraft={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        canSave={canSave}
        priceError={priceError}
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />
    </AdminShell>
  );
}
