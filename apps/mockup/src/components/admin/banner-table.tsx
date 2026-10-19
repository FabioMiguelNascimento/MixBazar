"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  createPaginatedRowModel,
  flexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type {
  CellData,
  RowData,
  TableFeatures,
} from "@tanstack/table-core";
import {
  ArrowDown,
  ArrowUp,
  CaretLeft,
  CaretRight,
  DotsThree,
  Pause,
  PencilSimple,
  Play,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuTrigger,
  type ResponsiveMenuItem,
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  tones,
} from "@repo/ui";
import {
  BANNER_STATUS_LABEL,
  BANNER_STATUS_TONE,
  type AdminBanner,
  type BannerStatus,
} from "@/components/admin/banner-model";

declare module "@tanstack/table-core" {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    align?: "left" | "center" | "right";
  }
}

const ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, AdminBanner>();

export function BannerTable({
  items,
  onEdit,
  onToggle,
  onDelete,
  onMove,
}: {
  items: AdminBanner[];
  onEdit: (item: AdminBanner) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    id: string;
    source: "dots" | "ctx";
  } | null>(null);

  function closeMenu() {
    setMenu(null);
    setConfirmId(null);
  }

  const ordered = useMemo(
    () => [...items].sort((a, b) => a.position - b.position),
    [items],
  );

  function menuItems(item: AdminBanner): ResponsiveMenuItem[] {
    const ToggleIcon = item.active ? Pause : Play;
    return [
      {
        label: "Editar",
        icon: <PencilSimple size={16} />,
        onSelect: () => onEdit(item),
      },
      {
        label: item.active ? "Pausar" : "Ativar",
        icon: <ToggleIcon size={16} />,
        onSelect: () => onToggle(item.id),
      },
      {
        label: "Subir",
        icon: <ArrowUp size={16} />,
        onSelect: () => onMove(item.id, -1),
      },
      {
        label: "Descer",
        icon: <ArrowDown size={16} />,
        onSelect: () => onMove(item.id, 1),
      },
      {
        label: "Excluir",
        icon: <Trash size={16} />,
        destructive: true,
        keepOpen: true,
        onSelect: () => setConfirmId(item.id),
      },
    ];
  }

  function statusOf(item: AdminBanner): BannerStatus {
    return item.active ? "ativa" : "pausada";
  }

  function confirmDelete(item: AdminBanner) {
    return (
      <div className="grid gap-2 p-1">
        <p className="font-heading text-sm font-semibold text-gunmetal">
          Excluir {item.title}?
        </p>
        <p className="text-sm leading-6 text-pine">
          O banner será removido permanentemente da vitrine.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmId(null)}
            className="rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(item.id);
              closeMenu();
            }}
            className="rounded-button border border-danger-border bg-danger-bg px-4 py-2 text-sm font-medium text-danger-text transition hover:opacity-90"
          >
            Excluir
          </button>
        </div>
      </div>
    );
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "banner",
        header: "Banner",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span className="flex min-w-0 items-center gap-3">
              {item.image.trim() !== "" ? (
                <img
                  src={item.image}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded-input bg-platinum object-cover"
                />
              ) : (
                <span className="h-10 w-16 shrink-0 rounded-input bg-platinum" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gunmetal">
                  {item.title}
                </span>
                <span className="block truncate text-xs text-pine/70">
                  {item.subtitle === "" ? item.link : item.subtitle}
                </span>
              </span>
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "posicao",
        header: "Posição",
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="font-heading text-sm font-semibold text-gunmetal">
            {row.original.position}º
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {BANNER_STATUS_LABEL[statusOf(row.original)]}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acoes",
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span className="flex justify-end">
              <ResponsiveMenu
                open={menu?.id === item.id && menu?.source === "dots"}
                onOpenChange={(next) => {
                  setMenu(next ? { id: item.id, source: "dots" } : null);
                  if (!next) setConfirmId(null);
                }}
              >
                <ResponsiveMenuTrigger>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setConfirmId(null);
                    }}
                    aria-label={`Ações do banner ${item.title}`}
                    className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                  >
                    <DotsThree size={20} weight="bold" />
                  </button>
                </ResponsiveMenuTrigger>
                <ResponsiveMenuContent
                  label={item.title}
                  items={menuItems(item)}
                >
                  {confirmId === item.id ? confirmDelete(item) : undefined}
                </ResponsiveMenuContent>
              </ResponsiveMenu>
            </span>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menu, confirmId],
  );

  const table = useTable({
    features,
    columns,
    data: ordered,
    initialState: { pagination: { pageIndex: 0, pageSize: 50 } },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const total = ordered.length;
  const pageStart = total === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="min-w-0">
      <div className="-mx-4 min-w-0 md:-mx-6 [&_[data-slot=table-container]]:max-h-[65dvh] [&_[data-slot=table-container]]:overflow-y-auto [&_[data-slot=table-container]]:rounded-none [&_[data-slot=table-container]]:border-x-0 [&_[data-slot=table-head]]:sticky [&_[data-slot=table-head]]:top-0 [&_[data-slot=table-head]]:z-10 [&_[data-slot=table-head]]:bg-background">
        <Table aria-label="Banners" className="w-max min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`h-9 normal-case tracking-normal ${ALIGN[header.column.columnDef.meta?.align ?? "left"]}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <ContextMenu
                key={row.id}
                open={menu?.id === row.original.id && menu?.source === "ctx"}
                onOpenChange={(next) => {
                  setMenu(
                    next ? { id: row.original.id, source: "ctx" } : null,
                  );
                  if (!next) setConfirmId(null);
                }}
              >
                <ContextMenuTrigger asChild>
                  <TableRow
                    onClick={(event) => {
                      if (
                        (event.target as HTMLElement).closest("tr") !==
                        event.currentTarget
                      ) {
                        return;
                      }
                      onEdit(row.original);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !(event.target as HTMLElement).closest("button")
                      ) {
                        onEdit(row.original);
                      }
                    }}
                    tabIndex={0}
                    className="cursor-pointer"
                  >
                    {row.getAllCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`py-2 ${ALIGN[cell.column.columnDef.meta?.align ?? "left"]} ${
                          cell.column.id === "status"
                            ? `border-b-0 ${tones[BANNER_STATUS_TONE[statusOf(row.original)]]} text-gunmetal`
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {row.original.id === confirmId
                    ? confirmDelete(row.original)
                    : menuItems(row.original).map((entry) => (
                        <ContextMenuItem
                          key={entry.label}
                          variant={entry.destructive ? "destructive" : "default"}
                          onClick={(event) => event.stopPropagation()}
                          onSelect={(event) => {
                            if (entry.keepOpen) event.preventDefault();
                            entry.onSelect();
                          }}
                        >
                          {entry.icon}
                          {entry.label}
                        </ContextMenuItem>
                      ))}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-pine/70">
          {pageStart}–{pageEnd} de {total}{" "}
          {total === 1 ? "banner" : "banners"}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
            className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Próxima página"
            className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
