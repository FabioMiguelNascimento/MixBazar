"use client";

import { Pause, PencilSimple, Play } from "@phosphor-icons/react/dist/ssr";
import {
  ResponsivePopover,
  ResponsivePopoverBody,
  ResponsivePopoverContent,
} from "@repo/ui";
import type { AdminCategory } from "@/components/admin/category-model";

export function CategoryMenu({
  item,
  anchor,
  point,
  onClose,
  onEdit,
  onToggle,
}: {
  item: AdminCategory | null;
  anchor: Element | null;
  point: { x: number; y: number } | null;
  onClose: () => void;
  onEdit: (item: AdminCategory) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <ResponsivePopover
      open={item !== null}
      modal
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      anchorEl={anchor}
      anchorPoint={point}
    >
      <ResponsivePopoverContent
        aria-label={item ? `Ações de ${item.name}` : "Ações da categoria"}
        className="sm:w-60"
      >
        {item && (
          <ResponsivePopoverBody className="gap-1 p-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="flex w-full items-center gap-2.5 rounded-input px-3 py-2 text-left text-sm text-gunmetal transition hover:bg-muted"
            >
              <PencilSimple size={16} className="shrink-0 text-pine" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                onToggle(item.id);
                onClose();
              }}
              className="flex w-full items-center gap-2.5 rounded-input px-3 py-2 text-left text-sm text-gunmetal transition hover:bg-muted"
            >
              {item.active ? (
                <Pause size={16} className="shrink-0 text-pine" />
              ) : (
                <Play size={16} className="shrink-0 text-pine" />
              )}
              {item.active ? "Pausar" : "Ativar"}
            </button>
          </ResponsivePopoverBody>
        )}
      </ResponsivePopoverContent>
    </ResponsivePopover>
  );
}
