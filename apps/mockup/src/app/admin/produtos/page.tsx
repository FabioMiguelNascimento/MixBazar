"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { ProductDrawer, type ProductDraft } from "@/components/admin/product-drawer";
import {
  buildDiscount,
  formatBare,
  parseBRL,
  parseDiscount,
  productCategories,
  productSlug,
  seedProducts,
  type AdminProduct,
  type DiscountType,
} from "@/components/admin/product-model";
import { ProductTable } from "@/components/admin/product-table";

const EMPTY_DRAFT: ProductDraft = {
  name: "",
  category: "",
  price: "",
  discountType: "none",
  discountAmount: "",
  description: "",
  images: [],
  active: true,
  composite: false,
  components: [],
};

function parseDiscountAmount(
  type: DiscountType,
  text: string,
  price: number | null,
): { amount: number | null; error: string | null } {
  if (type === "none") return { amount: null, error: null };
  if (text.trim() === "") return { amount: null, error: null };
  if (type === "percent") {
    if (!/^\d+$/.test(text.trim())) {
      return { amount: null, error: "Use um número inteiro de 1 a 90." };
    }
    const value = Number.parseInt(text.trim(), 10);
    if (value < 1 || value > 90) {
      return { amount: null, error: "Use um número inteiro de 1 a 90." };
    }
    return { amount: value, error: null };
  }
  const value = parseBRL(text);
  if (value === null || value <= 0) {
    return { amount: null, error: "Informe um valor maior que zero." };
  }
  if (price !== null && value >= price) {
    return { amount: null, error: "O desconto precisa ser menor que o preço." };
  }
  return { amount: value, error: null };
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>(seedProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState("geral");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>({
    ...EMPTY_DRAFT,
    category: productCategories[0] ?? "",
  });

  const priceValue = parseBRL(draft.price);
  const priceError =
    draft.price.trim() !== "" && priceValue === null
      ? "Informe um preço válido, ex. 97,90."
      : null;
  const discount = parseDiscountAmount(
    draft.discountType,
    draft.discountAmount,
    priceValue,
  );
  const discountPreview =
    draft.discountType !== "none" &&
    discount.amount !== null &&
    priceValue !== null
      ? (() => {
          const built = buildDiscount(
            priceValue,
            draft.discountType,
            discount.amount,
          );
          return built.badge !== null
            ? {
                oldPrice: priceValue,
                price: built.priceValue,
                badge: built.badge,
              }
            : null;
        })()
      : null;
  const componentsError =
    draft.composite && draft.components.length === 0
      ? "Adicione ao menos um componente."
      : null;
  const canSave =
    draft.name.trim() !== "" &&
    draft.category !== "" &&
    priceValue !== null &&
    priceError === null &&
    discount.error === null &&
    (draft.discountType === "none" || discount.amount !== null) &&
    componentsError === null &&
    draft.images.length > 0;

  function openNew() {
    setEditingId(null);
    setTab("geral");
    setDraft({ ...EMPTY_DRAFT, category: productCategories[0] ?? "" });
    setDialogOpen(true);
  }

  function openEdit(item: AdminProduct) {
    setTab("geral");
    const discount = parseDiscount(
      item.badge,
      item.oldPriceValue,
      item.priceValue,
    );
    setEditingId(item.id);
    setDraft({
      name: item.name,
      category: item.category,
      price: (item.oldPriceValue ?? item.priceValue)
        .toFixed(2)
        .replace(".", ","),
      discountType: discount.type,
      discountAmount: discount.amount,
      description: item.description,
      images: item.images,
      active: item.active,
      composite: item.composite,
      components: item.components,
    });
    setDialogOpen(true);
  }

  function save() {
    if (!canSave || priceValue === null) return;
    const pricing = buildDiscount(
      priceValue,
      draft.discountType,
      discount.amount,
    );
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
          oldPriceValue: pricing.oldPriceValue,
          badge: pricing.badge,
          description: draft.description.trim(),
          images: draft.images,
          active: draft.active,
          composite: draft.composite,
          components: draft.composite ? draft.components : [],
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
                priceValue: pricing.priceValue,
                oldPriceValue: pricing.oldPriceValue,
                badge: pricing.badge,
                description: draft.description.trim(),
                images: draft.images,
                active: draft.active,
                composite: draft.composite,
                components: draft.composite ? draft.components : [],
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
            data-helper="admin-novo"
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
        editingId={editingId}
        tab={tab}
        onTab={setTab}
        draft={draft}
        onDraft={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        canSave={canSave}
        priceError={priceError}
        discountError={discount.error}
        discountPreview={discountPreview}
        catalog={items}
        componentsError={componentsError}
        cheio={priceValue}
        finalPrice={discountPreview?.price ?? priceValue}
        onUseSumAsPrice={(sum) =>
          setDraft((prev) => ({
            ...prev,
            price: formatBare(Math.round(sum * 100) / 100),
          }))
        }
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />
    </AdminShell>
  );
}
