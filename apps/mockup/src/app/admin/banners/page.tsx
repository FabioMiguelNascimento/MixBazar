"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { BannerDrawer, type BannerDraft } from "@/components/admin/banner-drawer";
import { BannerTable } from "@/components/admin/banner-table";
import {
  bannerSlug,
  seedBanners,
  type AdminBanner,
} from "@/components/admin/banner-model";

const EMPTY_DRAFT: BannerDraft = {
  title: "",
  subtitle: "",
  image: "",
  link: "/catalogo",
  position: "",
  active: true,
};

export default function AdminBannersPage() {
  const [items, setItems] = useState<AdminBanner[]>(seedBanners);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BannerDraft>(EMPTY_DRAFT);

  const titleError =
    draft.title.trim() === "" ? "Informe o título do banner." : null;
  const positionValue =
    draft.position.trim() === ""
      ? null
      : Number.parseInt(draft.position.trim(), 10);
  const positionError =
    draft.position.trim() === ""
      ? null
      : Number.isInteger(positionValue) && (positionValue as number) >= 1
        ? null
        : "Informe uma posição de ao menos 1.";
  const canSave =
    titleError === null &&
    positionValue !== null &&
    positionError === null;

  function openNew() {
    setEditingId(null);
    setDraft({
      ...EMPTY_DRAFT,
      position: String(
        items.reduce((max, item) => Math.max(max, item.position), 0) + 1,
      ),
    });
    setDialogOpen(true);
  }

  function openEdit(item: AdminBanner) {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      link: item.link,
      position: String(item.position),
      active: item.active,
    });
    setDialogOpen(true);
  }

  function save() {
    if (!canSave) return;
    if (editingId === null) {
      const id = bannerSlug(
        draft.title,
        new Set(items.map((item) => item.id)),
      );
      setItems([
        ...items,
        {
          id,
          title: draft.title.trim(),
          subtitle: draft.subtitle.trim(),
          image: draft.image.trim(),
          link: draft.link.trim() === "" ? "/catalogo" : draft.link.trim(),
          position: positionValue as number,
          active: draft.active,
        },
      ]);
    } else {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: draft.title.trim(),
                subtitle: draft.subtitle.trim(),
                image: draft.image.trim(),
                link:
                  draft.link.trim() === "" ? "/catalogo" : draft.link.trim(),
                position: positionValue as number,
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

  function move(id: string, direction: -1 | 1) {
    setItems((prev) => {
      const ordered = [...prev].sort((a, b) => a.position - b.position);
      const index = ordered.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= ordered.length) return prev;
      const current = ordered[index];
      const other = ordered[target];
      return prev.map((item) => {
        if (item.id === current.id) return { ...item, position: other.position };
        if (item.id === other.id) return { ...item, position: current.position };
        return item;
      });
    });
  }

  return (
    <AdminShell active="Banners" title="Banners">
      <AdminPageHeader
        actions={
          <button
            type="button"
            onClick={openNew}
            data-helper="admin-novo"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
          >
            <Plus size={16} weight="bold" />
            Novo banner
          </button>
        }
      />

      <div className="mt-10 min-w-0">
        <BannerTable
          items={items}
          onEdit={openEdit}
          onToggle={toggleActive}
          onDelete={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
          onMove={move}
        />
      </div>

      <BannerDrawer
        open={dialogOpen}
        editing={editingId !== null}
        draft={draft}
        onDraft={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        canSave={canSave}
        titleError={titleError}
        positionError={positionError}
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />
    </AdminShell>
  );
}
