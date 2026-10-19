"use client";

import { formatBRL } from "@/components/admin/product-model";
import {
  NEXT_STATUS,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  orderDate,
  type AdminOrder,
  type OrderStatus,
} from "@/data/admin";
import {
  ArrowRight,
  Bell,
  CaretLeft,
  CaretRight,
  CheckCircle,
  CookingPot,
  DotsThree,
  Eye,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  tones,
  type ResponsiveMenuItem,
} from "@repo/ui";
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
import { useMemo, useState } from "react";

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

const MODE_LABEL = {
  entrega: "Entrega",
  retirada: "Retirada",
} as const;

const MODE_TONE = {
  entrega: "info",
  retirada: "warning",
} as const;

const STAGE_ICON = {
  novo: Bell,
  preparo: CookingPot,
  pronto: CheckCircle,
  entregue: Truck,
} as const;

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, AdminOrder>();

export function OrderTable({
  items,
  onOpen,
  onAdvance,
}: {
  items: AdminOrder[];
  onOpen: (item: AdminOrder) => void;
  onAdvance: (item: AdminOrder) => void;
}) {
  const [menu, setMenu] = useState<{
    id: string;
    source: "dots" | "ctx";
  } | null>(null);

  function closeMenu() {
    setMenu(null);
  }

  function menuItems(item: AdminOrder): ResponsiveMenuItem[] {
    const next = NEXT_STATUS[item.status];
    return [
      {
        label: "Ver detalhes",
        icon: <Eye size={16} />,
        onSelect: () => onOpen(item),
      },
      ...(next
        ? [
            {
              label: `Avançar para ${ORDER_STATUS_LABEL[next].toLowerCase()}`,
              icon: <ArrowRight size={16} />,
              onSelect: () => onAdvance(item),
            },
          ]
        : []),
    ];
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "pedido",
        header: "Pedido",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span className="block truncate text-sm font-medium text-gunmetal">
              #{item.number} {item.customer}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "total",
        header: "Total",
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="font-heading text-sm font-semibold text-gunmetal">
            {formatBRL(row.original.total)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "modo",
        header: "Modo",
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {MODE_LABEL[row.original.mode]}
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        meta: { align: "center" },
        cell: ({ row }) => (
          <OrderStatusCell status={row.original.status} />
        ),
      }),
      columnHelper.display({
        id: "quando",
        header: "Quando",
        meta: { align: "right" },
        cell: ({ row }) => {
          const when = orderDate(row.original.daysAgo);
          return (
            <span className="block min-w-0">
              <span className="block text-sm font-medium text-gunmetal">
                {when.date}
              </span>
              <span className="block text-xs text-pine/70">
                {when.relative}
              </span>
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
                open={menu?.id === item.id && menu?.source === "dots"}
                onOpenChange={(next) => {
                  setMenu(next ? { id: item.id, source: "dots" } : null);
                }}
              >
                <ResponsiveMenuTrigger>
                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={`Ações do pedido #${item.number}`}
                    className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                  >
                    <DotsThree size={20} weight="bold" />
                  </button>
                </ResponsiveMenuTrigger>
                <ResponsiveMenuContent
                  label={`Pedido #${item.number}`}
                  items={menuItems(item)}
                />
              </ResponsiveMenu>
            </span>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menu],
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
        <Table aria-label="Pedidos" className="w-max min-w-full">
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
                }}
              >
                <ContextMenuTrigger asChild>
                  <TableRow
                    data-helper="admin-pedido-linha"
                    onClick={(event) => {
                      if (
                        (event.target as HTMLElement).closest("tr") !==
                        event.currentTarget
                      ) {
                        return;
                      }
                      onOpen(row.original);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !(event.target as HTMLElement).closest("button")
                      ) {
                        onOpen(row.original);
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
                            ? `border-b-0 ${tones[ORDER_STATUS_TONE[row.original.status]]} text-gunmetal`
                            : cell.column.id === "modo"
                              ? `border-b-0 ${tones[MODE_TONE[row.original.mode]]} text-gunmetal`
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
                  {menuItems(row.original).map((entry) => (
                    <ContextMenuItem
                      key={entry.label}
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
          {items.length === 1 ? "pedido" : "pedidos"}
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

function OrderStatusCell({ status }: { status: OrderStatus }) {
  const Icon = STAGE_ICON[status];
  return (
    <span className="relative block text-center">
      <Icon
        size={15}
        weight="fill"
        className="absolute top-1/2 left-2 -translate-y-1/2"
      />
      <span className="block py-0.5 pr-1 pl-7 text-sm font-medium">
        {ORDER_STATUS_LABEL[status]}
      </span>
    </span>
  );
}
