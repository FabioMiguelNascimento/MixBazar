"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { CampaignDrawer, type CampaignDraft } from "@/components/admin/campaign-drawer";
import { CampaignTable } from "@/components/admin/campaign-table";
import {
  campaignDateError,
  campaignSlug,
  seedCampaignsFull,
  type AdminCampaignFull,
} from "@/components/admin/campaign-model";
import { couponCodeError } from "@/components/admin/coupon-model";

const EMPTY_DRAFT: CampaignDraft = {
  name: "",
  couponCode: "",
  limit: "",
  startsAt: "",
  endsAt: "",
  active: true,
  productIds: [],
};

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<AdminCampaignFull[]>(seedCampaignsFull);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState("geral");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CampaignDraft>(EMPTY_DRAFT);

  const editingItem =
    editingId === null
      ? null
      : (items.find((item) => item.id === editingId) ?? null);

  const nameError =
    draft.name.trim() === "" ? "Informe o nome da campanha." : null;
  const codeError = couponCodeError(draft.couponCode);
  const duplicate =
    codeError === null &&
    items.some(
      (item) =>
        item.id !== editingId &&
        item.couponCode === draft.couponCode.trim().toUpperCase(),
    );
  const limitValue =
    draft.limit.trim() === "" ? null : Number.parseInt(draft.limit.trim(), 10);
  const limitError =
    draft.limit.trim() === ""
      ? null
      : Number.isInteger(limitValue) && (limitValue as number) >= 1
        ? null
        : "Informe um limite de ao menos 1 uso.";
  const datesError = campaignDateError(draft.startsAt, draft.endsAt);
  const canSave =
    nameError === null &&
    codeError === null &&
    !duplicate &&
    limitValue !== null &&
    limitError === null &&
    draft.startsAt !== "" &&
    draft.endsAt !== "" &&
    datesError === null;

  function openNew() {
    setEditingId(null);
    setTab("geral");
    setDraft(EMPTY_DRAFT);
    setDialogOpen(true);
  }

  function openEdit(item: AdminCampaignFull) {
    setEditingId(item.id);
    setTab("geral");
    setDraft({
      name: item.name,
      couponCode: item.couponCode,
      limit: String(item.limit),
      startsAt: item.startsAt,
      endsAt: item.endsAt,
      active: item.active,
      productIds: item.productIds,
    });
    setDialogOpen(true);
  }

  function save() {
    if (!canSave) return;
    if (editingId === null) {
      const id = campaignSlug(
        draft.name,
        new Set(items.map((item) => item.id)),
      );
      setItems([
        ...items,
        {
          id,
          name: draft.name.trim(),
          couponCode: draft.couponCode.trim().toUpperCase(),
          startsAt: draft.startsAt,
          endsAt: draft.endsAt,
          used: 0,
          limit: limitValue as number,
          active: draft.active,
          scheduled: false,
          productIds: draft.productIds,
        },
      ]);
    } else {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: draft.name.trim(),
                couponCode: draft.couponCode.trim().toUpperCase(),
                limit: Math.max(item.used, limitValue as number),
                startsAt: draft.startsAt,
                endsAt: draft.endsAt,
                active: draft.active,
                scheduled: false,
                productIds: draft.productIds,
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
    <AdminShell active="Campanhas" title="Campanhas">
      <AdminPageHeader
        actions={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
          >
            <Plus size={16} weight="bold" />
            Nova campanha
          </button>
        }
      />

      <div className="mt-10 min-w-0">
        <CampaignTable
          items={items}
          onEdit={openEdit}
          onToggle={toggleActive}
          onDelete={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
        />
      </div>

      <CampaignDrawer
        open={dialogOpen}
        editing={editingId !== null}
        tab={tab}
        onTab={setTab}
        draft={draft}
        onDraft={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        canSave={canSave}
        nameError={nameError}
        codeError={duplicate ? "Este código já está em uso." : codeError}
        limitError={limitError}
        datesError={datesError}
        codeLocked={(editingItem?.used ?? 0) > 0}
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />
    </AdminShell>
  );
}
