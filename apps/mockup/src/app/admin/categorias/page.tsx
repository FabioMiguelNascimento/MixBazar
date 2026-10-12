"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { CategoryDrawer } from "@/components/admin/category-drawer";
import {
  seedCategories,
  slugify,
  type AdminCategory,
  type PickerId,
} from "@/components/admin/category-model";
import { CategoryPickers } from "@/components/admin/category-pickers";
import { CategoryTable } from "@/components/admin/category-table";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>(seedCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [picker, setPicker] = useState<{
    id: PickerId;
    anchor: Element;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [icon, setIcon] = useState("folder");
  const [tint, setTint] = useState<string>(
    "bg-jungle/10 text-jungle",
  );
  const [image, setImage] = useState("");

  const trimmed = name.trim();
  const editing = editingId !== null;

  function openNew() {
    setEditingId(null);
    setName("");
    setActive(true);
    setIcon("folder");
    setTint("bg-jungle/10 text-jungle");
    setImage("");
    setDialogOpen(true);
  }

  function openEdit(item: AdminCategory) {
    setEditingId(item.id);
    setName(item.name);
    setActive(item.active);
    setIcon(item.icon);
    setTint(item.tint);
    setImage(item.image);
    setDialogOpen(true);
  }

  function closeDrawer() {
    setDialogOpen(false);
    setPicker(null);
  }

  function save() {
    if (trimmed === "") return;
    if (editingId === null) {
      const base = slugify(trimmed);
      const taken = new Set(items.map((item) => item.id));
      let id = base;
      let suffix = 2;
      while (taken.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      setItems([...items, { id, name: trimmed, active, icon, tint, image }]);
    } else {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? { ...item, name: trimmed, active, icon, tint, image }
            : item,
        ),
      );
    }
    closeDrawer();
  }

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  }

  return (
    <AdminShell active="Categorias" title="Categorias">
      <AdminPageHeader
        actions={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
          >
            <Plus size={16} weight="bold" />
            Nova categoria
          </button>
        }
      />

      <div className="mt-10 min-w-0">
        <CategoryTable
          items={items}
          onEdit={openEdit}
          onToggle={toggleActive}
          onDelete={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
        />
      </div>

      <CategoryDrawer
        open={dialogOpen}
        editing={editing}
        draft={{ name, active, icon, tint, image }}
        onDraft={(patch) => {
          if (patch.name !== undefined) setName(patch.name);
          if (patch.active !== undefined) setActive(patch.active);
          if (patch.icon !== undefined) setIcon(patch.icon);
          if (patch.tint !== undefined) setTint(patch.tint);
          if (patch.image !== undefined) setImage(patch.image);
        }}
        canSave={trimmed !== ""}
        onClose={closeDrawer}
        onSave={save}
        onOpenPicker={(id, anchor) => setPicker({ id, anchor })}
      />

      <CategoryPickers
        picker={picker}
        icon={icon}
        tint={tint}
        image={image}
        onIcon={setIcon}
        onTint={setTint}
        onImage={setImage}
        onClose={() => setPicker(null)}
      />
    </AdminShell>
  );
}
