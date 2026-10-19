"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { CouponDrawer, type CouponDraft } from "@/components/admin/coupon-drawer";
import { CouponTable } from "@/components/admin/coupon-table";
import {
  couponCodeError,
  couponDateError,
  seedCoupons,
  type AdminCoupon,
} from "@/components/admin/coupon-model";
import { parseBRL } from "@/components/admin/product-model";

const EMPTY_DRAFT: CouponDraft = {
  code: "",
  campaign: "",
  type: "percent",
  amount: "",
  limit: "",
  startsAt: "",
  endsAt: "",
  active: true,
};

export default function AdminCouponsPage() {
  const [items, setItems] = useState<AdminCoupon[]>(seedCoupons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [draft, setDraft] = useState<CouponDraft>(EMPTY_DRAFT);

  const editingItem =
    editingCode === null
      ? null
      : (items.find((item) => item.code === editingCode) ?? null);

  const codeError = couponCodeError(draft.code);
  const duplicate =
    codeError === null &&
    (editingCode === null
      ? items.some((item) => item.code === draft.code.trim().toUpperCase())
      : items.some(
          (item) =>
            item.code !== editingCode &&
            item.code === draft.code.trim().toUpperCase(),
        ));
  const amountValue =
    draft.amount.trim() === "" ? null : parseBRL(draft.amount);
  const amountError =
    draft.type === "percent"
      ? draft.amount.trim() === ""
        ? null
        : /^\d+$/.test(draft.amount.trim()) &&
            Number.parseInt(draft.amount.trim(), 10) >= 1 &&
            Number.parseInt(draft.amount.trim(), 10) <= 90
          ? null
          : "Use um número inteiro de 1 a 90."
      : draft.amount.trim() === ""
        ? null
        : amountValue !== null && amountValue > 0
          ? null
          : "Informe um valor maior que zero.";
  const limitValue =
    draft.limit.trim() === "" ? null : Number.parseInt(draft.limit.trim(), 10);
  const limitError =
    draft.limit.trim() === ""
      ? null
      : Number.isInteger(limitValue) && (limitValue as number) >= 1
        ? null
        : "Informe um limite de ao menos 1 uso.";
  const daysError = couponDateError(draft.startsAt, draft.endsAt);
  const canSave =
    codeError === null &&
    !duplicate &&
    (draft.type === "percent"
      ? draft.amount.trim() !== "" && amountError === null
      : amountValue !== null) &&
    limitValue !== null &&
    limitError === null &&
    draft.startsAt !== "" &&
    draft.endsAt !== "" &&
    daysError === null;

  function openNew() {
    setEditingCode(null);
    setDraft(EMPTY_DRAFT);
    setDialogOpen(true);
  }

  function openEdit(item: AdminCoupon) {
    setEditingCode(item.code);
    setDraft({
      code: item.code,
      campaign: item.campaign,
      type: item.type,
      amount:
        item.type === "percent"
          ? String(item.amount)
          : item.amount.toFixed(2).replace(".", ","),
      limit: String(item.limit),
      startsAt: item.startsAt,
      endsAt: item.endsAt,
      active: item.active,
    });
    setDialogOpen(true);
  }

  function save() {
    if (!canSave) return;
    const amount =
      draft.type === "percent"
        ? Number.parseInt(draft.amount.trim(), 10)
        : (amountValue as number);
    if (editingCode === null) {
      setItems([
        ...items,
        {
          code: draft.code.trim().toUpperCase(),
          campaign: draft.campaign.trim(),
          type: draft.type,
          amount,
          used: 0,
          limit: limitValue as number,
          startsAt: draft.startsAt,
          endsAt: draft.endsAt,
          active: draft.active,
        },
      ]);
    } else {
      setItems(
        items.map((item) =>
          item.code === editingCode
            ? {
                ...item,
                code: draft.code.trim().toUpperCase(),
                campaign: draft.campaign.trim(),
                type: draft.type,
                amount,
                limit: Math.max(item.used, limitValue as number),
                startsAt: draft.startsAt,
                endsAt: draft.endsAt,
                active: draft.active,
              }
            : item,
        ),
      );
    }
    setDialogOpen(false);
  }

  function toggleActive(code: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, active: !item.active } : item,
      ),
    );
  }

  return (
    <AdminShell active="Cupons" title="Cupons">
      <AdminPageHeader
        actions={
          <button
            type="button"
            onClick={openNew}
            data-helper="admin-novo"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
          >
            <Plus size={16} weight="bold" />
            Novo cupom
          </button>
        }
      />

      <div className="mt-10 min-w-0">
        <CouponTable
          items={items}
          onEdit={openEdit}
          onToggle={toggleActive}
          onDelete={(code) =>
            setItems((prev) => prev.filter((item) => item.code !== code))
          }
        />
      </div>

      <CouponDrawer
        open={dialogOpen}
        editing={editingCode !== null}
        draft={draft}
        onDraft={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        canSave={canSave}
        codeError={
          duplicate ? "Este código já está em uso." : codeError
        }
        amountError={amountError}
        limitError={limitError}
        datesError={daysError}
        codeLocked={(editingItem?.used ?? 0) > 0}
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />
    </AdminShell>
  );
}
