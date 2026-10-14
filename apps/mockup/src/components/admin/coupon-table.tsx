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
  COUPON_STATUS_LABEL,
  COUPON_STATUS_TONE,
  couponDiscountLabel,
  couponStatus,
  couponUsagePct,
  couponValidityLabel,
  type AdminCoupon,
} from "@/components/admin/coupon-model";

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

const columnHelper = createColumnHelper<typeof features, AdminCoupon>();

export function CouponTable({
  items,
  onEdit,
  onToggle,
  onDelete,
}: {
  items: AdminCoupon[];
  onEdit: (item: AdminCoupon) => void;
  onToggle: (code: string) => void;
  onDelete: (code: string) => void;
}) {
  const [confirmCode, setConfirmCode] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    id: string;
    source: "dots" | "ctx";
  } | null>(null);

  function closeMenu() {
    setMenu(null);
    setConfirmCode(null);
  }

  function menuItems(item: AdminCoupon): ResponsiveMenuItem[] {
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
        onSelect: () => onToggle(item.code),
      },
      {
        label: "Excluir",
        icon: <Trash size={16} />,
        destructive: true,
        keepOpen: true,
        onSelect: () => setConfirmCode(item.code),
      },
    ];
  }

  function confirmDelete(item: AdminCoupon) {
    return (
      <div className="grid gap-2 p-1">
        <p className="font-heading text-sm font-semibold text-gunmetal">
          Excluir {item.code}?
        </p>
        <p className="text-sm leading-6 text-pine">
          O cupom será removido permanentemente
          {item.used > 0
            ? ` com ${item.used} ${item.used === 1 ? "uso registrado" : "usos registrados"}.`
            : "."}
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmCode(null)}
            className="rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(item.code);
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
        id: "cupom",
        header: "Cupom",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span className="block min-w-0">
              <span className="block truncate font-heading text-sm font-semibold tracking-wide text-gunmetal">
                {item.code}
              </span>
              <span className="block truncate text-xs text-pine/70">
                {item.campaign === ""
                  ? couponDiscountLabel(item)
                  : `${item.campaign} · ${couponDiscountLabel(item)}`}
              </span>
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "uso",
        header: "Uso",
        cell: ({ row }) => {
          const item = row.original;
          const pct = couponUsagePct(item);
          return (
            <span className="block min-w-24">
              <span className="flex items-baseline justify-between gap-2 text-xs text-pine">
                <span>
                  {item.used}/{item.limit}
                </span>
                <span className="font-heading font-semibold text-gunmetal">
                  {pct}%
                </span>
              </span>
              <span
                aria-hidden="true"
                className="mt-1 block h-1 overflow-hidden rounded-full bg-muted"
              >
                <span
                  className="block h-full rounded-full bg-jungle"
                  style={{ width: `${pct}%` }}
                />
              </span>
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "validade",
        header: "Validade",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-pine">
            {couponValidityLabel(row.original)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        meta: { align: "center" },
        cell: ({ row }) => {
          const status = couponStatus(row.original);
          return (
            <span className="text-sm font-medium">
              {COUPON_STATUS_LABEL[status]}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "acoes",
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span className="flex justify-end">
              <ResponsiveMenu
                open={menu?.id === item.code && menu?.source === "dots"}
                onOpenChange={(next) => {
                  setMenu(next ? { id: item.code, source: "dots" } : null);
                  if (!next) setConfirmCode(null);
                }}
              >
                <ResponsiveMenuTrigger>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setConfirmCode(null);
                    }}
                    aria-label={`Ações do cupom ${item.code}`}
                    className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                  >
                    <DotsThree size={20} weight="bold" />
                  </button>
                </ResponsiveMenuTrigger>
                <ResponsiveMenuContent
                  label={item.code}
                  items={menuItems(item)}
                >
                  {confirmCode === item.code
                    ? confirmDelete(item)
                    : undefined}
                </ResponsiveMenuContent>
              </ResponsiveMenu>
            </span>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menu, confirmCode],
  );

  const table = useTable({
    features,
    columns,
    data: items,
    initialState: { pagination: { pageIndex: 0, pageSize: 50 } },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const pageStart = items.length === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min(items.length, (pageIndex + 1) * pageSize);

  return (
    <div className="min-w-0">
      <div className="-mx-4 min-w-0 md:-mx-6 [&_[data-slot=table-container]]:max-h-[65dvh] [&_[data-slot=table-container]]:overflow-y-auto [&_[data-slot=table-container]]:rounded-none [&_[data-slot=table-container]]:border-x-0 [&_[data-slot=table-head]]:sticky [&_[data-slot=table-head]]:top-0 [&_[data-slot=table-head]]:z-10 [&_[data-slot=table-head]]:bg-background">
        <Table aria-label="Cupons" className="w-max min-w-full">
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
                open={menu?.id === row.original.code && menu?.source === "ctx"}
                onOpenChange={(next) => {
                  setMenu(
                    next ? { id: row.original.code, source: "ctx" } : null,
                  );
                  if (!next) setConfirmCode(null);
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
                            ? `border-b-0 ${tones[COUPON_STATUS_TONE[couponStatus(row.original)]]} text-gunmetal`
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
                  {row.original.code === confirmCode
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
          {pageStart}–{pageEnd} de {items.length}{" "}
          {items.length === 1 ? "cupom" : "cupons"}
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
