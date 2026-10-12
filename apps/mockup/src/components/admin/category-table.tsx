"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  createPaginatedRowModel,
  flexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  CaretLeft,
  CaretRight,
  DotsThree,
  FolderSimple,
} from "@phosphor-icons/react/dist/ssr";
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
  ICONS,
  STATUS_TONE,
  productCount,
  type AdminCategory,
} from "@/components/admin/category-model";

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, AdminCategory>();

export function CategoryTable({
  items,
  onEdit,
  onMenu,
}: {
  items: AdminCategory[];
  onEdit: (item: AdminCategory) => void;
  onMenu: (item: AdminCategory, anchor: Element, point?: { x: number; y: number }) => void;
}) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "categoria",
        header: "Categoria",
        cell: ({ row }) => {
          const item = row.original;
          const Icon = ICONS[item.icon] ?? FolderSimple;
          const count = productCount(item.name);
          return (
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-input ${item.tint}`}
              >
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gunmetal">
                  {item.name}
                </span>
                <span className="block text-xs text-pine/70">
                  {count === 1 ? "1 produto" : `${count} produtos`}
                </span>
              </span>
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {row.original.active ? "Ativa" : "Pausada"}
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
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMenu(item, event.currentTarget);
                }}
                aria-label={`Ações de ${item.name}`}
                aria-haspopup="dialog"
                className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
              >
                <DotsThree size={20} weight="bold" />
              </button>
            </span>
          );
        },
      }),
    ],
    [onMenu],
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
      <div className="-mx-4 min-w-0 md:-mx-6 [&_[data-slot=table-container]]:max-h-[65dvh] [&_[data-slot=table-container]]:overflow-y-auto [&_[data-slot=table-container]]:rounded-none [&_[data-slot=table-container]]:border-x-0 [&_[data-slot=table-header]]:sticky [&_[data-slot=table-header]]:top-0 [&_[data-slot=table-header]]:bg-background">
        <Table aria-label="Categorias">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-9 normal-case tracking-normal"
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
              <TableRow
                key={row.id}
                onClick={() => onEdit(row.original)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onMenu(row.original, event.currentTarget, {
                    x: event.clientX,
                    y: event.clientY,
                  });
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
                    className={
                      cell.column.id === "status"
                        ? `py-2 ${tones[STATUS_TONE[row.original.active ? "ativa" : "pausada"]]}`
                        : "py-2"
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-pine/70">
          {pageStart}–{pageEnd} de {items.length}{" "}
          {items.length === 1 ? "categoria" : "categorias"}
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
