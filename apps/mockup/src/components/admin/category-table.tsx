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
  Pause,
  PencilSimple,
  Play,
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
import type {
  CellData,
  RowData,
  TableFeatures,
} from "@tanstack/table-core";
import {
  ICONS,
  STATUS_TONE,
  productCount,
  type AdminCategory,
} from "@/components/admin/category-model";

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

const columnHelper = createColumnHelper<typeof features, AdminCategory>();

export function CategoryTable({
  items,
  onEdit,
  onToggle,
}: {
  items: AdminCategory[];
  onEdit: (item: AdminCategory) => void;
  onToggle: (id: string) => void;
}) {
  function menuItems(item: AdminCategory): ResponsiveMenuItem[] {
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
    ];
  }

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
        meta: { align: "center" },
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
              <ResponsiveMenu>
                <ResponsiveMenuTrigger>
                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={`Ações de ${item.name}`}
                    className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                  >
                    <DotsThree size={20} weight="bold" />
                  </button>
                </ResponsiveMenuTrigger>
                <ResponsiveMenuContent
                  label={item.name}
                  items={menuItems(item)}
                />
              </ResponsiveMenu>
            </span>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
        <Table aria-label="Categorias" className="w-max min-w-full">
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
              <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    onClick={() => onEdit(row.original)}
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
                            ? `py-2 ${ALIGN[cell.column.columnDef.meta?.align ?? "left"]} ${tones[STATUS_TONE[row.original.active ? "ativa" : "pausada"]]} text-gunmetal`
                            : "py-2"
                        }
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
                      onSelect={entry.onSelect}
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
