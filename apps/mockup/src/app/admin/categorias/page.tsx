"use client";

import { useMemo, useRef, useState } from "react";
import {
  createColumnHelper,
  createPaginatedRowModel,
  flexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  Basket,
  CaretDown,
  CaretLeft,
  CaretRight,
  DotsThree,
  Flower,
  FolderSimple,
  Gift,
  Image as ImageIcon,
  Package,
  Pause,
  PencilLine,
  PencilSimple,
  Play,
  Plus,
  Storefront,
  Tag,
  UploadSimple,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { Field, FormGrid } from "@/components/admin-form";
import {
  Badge,
  Input,
  Label,
  ResponsivePopover,
  ResponsivePopoverBody,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { categories as catalogCategories, products } from "@/data/catalog";

type AdminCategory = {
  id: string;
  name: string;
  active: boolean;
  icon: string;
  tint: string;
  image: string;
};

const ICONS: Record<string, typeof Basket> = {
  basket: Basket,
  flower: Flower,
  gift: Gift,
  school: PencilLine,
  store: Storefront,
  package: Package,
  folder: FolderSimple,
  tag: Tag,
};

const TINTS = [
  { label: "Verde", value: "bg-jungle/10 text-jungle" },
  { label: "Pinheiro", value: "bg-pine/10 text-pine" },
  { label: "Lima", value: "bg-lime/25 text-pine" },
  { label: "Neutro", value: "bg-muted text-pine" },
] as const;

function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug === "" ? "categoria" : slug;
}

const ICON_BY_NAME: Record<string, string> = {
  Cestas: "basket",
  Flores: "flower",
  Presentes: "gift",
  Escolar: "school",
  Bazar: "store",
  Encomendas: "package",
};

const seedCategories: AdminCategory[] = catalogCategories.map((category) => ({
  id: slugify(category.name),
  name: category.name,
  active: true,
  icon: ICON_BY_NAME[category.name] ?? "folder",
  tint: category.tint,
  image: category.image,
}));

function productCount(name: string) {
  return products.filter((product) => product.category === name).length;
}

const MAX_COVER_BYTES = 2 * 1024 * 1024;

function CoverField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      setError("A imagem precisa ter até 2 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () =>
      onChange(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setError("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-2">
      <span id="category-cover-label" className="text-sm font-medium">
        Capa
      </span>
      <div
        role="button"
        tabIndex={0}
        aria-labelledby="category-cover-label"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`relative flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-input border border-dashed px-4 py-6 text-center transition ${
          dragging
            ? "border-jungle bg-jungle/5"
            : "border-border hover:border-jungle"
        }`}
      >
        {value.trim() !== "" ? (
          <>
            <img
              src={value}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange("");
              }}
              aria-label="Remover capa"
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-gunmetal/60 text-platinum transition hover:bg-gunmetal/80"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <span className="flex size-10 items-center justify-center rounded-full bg-platinum text-pine">
              {dragging ? <UploadSimple size={20} /> : <ImageIcon size={20} />}
            </span>
            <span className="text-sm font-medium text-gunmetal">
              Arraste a imagem ou clique para escolher
            </span>
            <span className="text-xs text-pine/70">
              PNG, JPG ou SVG até 2 MB
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <Input
        id="category-cover-url"
        value={value.startsWith("data:") ? "" : value}
        onChange={(event) => {
          setError(null);
          onChange(event.target.value);
        }}
        placeholder="Ou cole a URL da imagem"
        inputMode="url"
      />
      {error !== null && (
        <p role="alert" className="text-xs font-medium text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>(seedCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [picker, setPicker] = useState<{
    id: "icon" | "tint" | "cover";
    anchor: Element;
  } | null>(null);
  const [menu, setMenu] = useState<{
    id: string;
    anchor: Element;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [icon, setIcon] = useState("folder");
  const [tint, setTint] = useState<string>(TINTS[0].value);
  const [image, setImage] = useState("");

  const trimmed = name.trim();
  const editing = editingId !== null;
  const SelectedIcon = ICONS[icon] ?? FolderSimple;
  const selectedTintLabel =
    TINTS.find((option) => option.value === tint)?.label ?? "Cor";

  function openNew() {
    setEditingId(null);
    setName("");
    setActive(true);
    setIcon("folder");
    setTint(TINTS[0].value);
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
    setDialogOpen(false);
  }

  function toggleActive(id: string) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  }

  function openMenu(item: AdminCategory, anchor: Element) {
    setPicker(null);
    setMenu({ id: item.id, anchor });
  }

  const features = useMemo(
    () =>
      tableFeatures({
        rowPaginationFeature,
        paginatedRowModel: createPaginatedRowModel(),
      }),
    [],
  );

  const columnHelper = useMemo(
    () => createColumnHelper<typeof features, AdminCategory>(),
    [],
  );

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
          <Badge variant={row.original.active ? "default" : "secondary"}>
            {row.original.active ? "Ativa" : "Pausada"}
          </Badge>
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
                  openMenu(item, event.currentTarget);
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
    [columnHelper],
  );

  const table = useTable({
    features,
    columns,
    data: items,
    initialState: { pagination: { pageIndex: 0, pageSize: 50 } },
  });

  const menuItem = items.find((item) => item.id === menu?.id) ?? null;
  const { pageIndex, pageSize } = table.state.pagination;
  const pageStart = items.length === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min(items.length, (pageIndex + 1) * pageSize);

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
                  onClick={() => openEdit(row.original)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    openMenu(
                      row.original,
                      event.currentTarget as Element,
                    );
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !(event.target as HTMLElement).closest("button")
                    ) {
                      openEdit(row.original);
                    }
                  }}
                  tabIndex={0}
                  className="cursor-pointer"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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

      <Sheet
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) setPicker(null);
        }}
      >
        <SheetContent
          aria-describedby={undefined}
          className="w-[94vw] p-0 sm:max-w-xl"
        >
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
            <SheetTitle>
              {editing ? "Editar categoria" : "Nova categoria"}
            </SheetTitle>
          </SheetHeader>

          <FormGrid className="min-h-0 flex-1 content-start overflow-y-auto px-6 py-4">
            <Field span={12}>
              <div className="grid gap-2">
                <Label htmlFor="category-name">Nome</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex. Aniversário"
                  autoFocus
                />
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
              <span className="text-sm font-medium">Ícone</span>
              <button
                type="button"
                onClick={(event) =>
                  setPicker({ id: "icon", anchor: event.currentTarget })
                }
                aria-haspopup="dialog"
                className="flex min-h-14 items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-input ${tint}`}
                >
                  <SelectedIcon size={18} />
                </span>
                <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                  Trocar ícone
                </span>
                <CaretDown size={16} className="shrink-0 text-pine/60" />
              </button>
              </div>
            </Field>
            <Field span={6}>
              <div className="grid gap-2">
              <span className="text-sm font-medium">Cor</span>
              <button
                type="button"
                onClick={(event) =>
                  setPicker({ id: "tint", anchor: event.currentTarget })
                }
                aria-haspopup="dialog"
                className="flex min-h-14 items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
              >
                <span
                  aria-hidden="true"
                  className={`size-6 shrink-0 rounded-full ${tint}`}
                />
                <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                  {selectedTintLabel}
                </span>
                <CaretDown size={16} className="shrink-0 text-pine/60" />
              </button>
              </div>
            </Field>
            <Field span={12}>
              <div className="grid gap-2">
              <span className="text-sm font-medium">Capa</span>
              <button
                type="button"
                onClick={(event) =>
                  setPicker({ id: "cover", anchor: event.currentTarget })
                }
                aria-haspopup="dialog"
                className="flex items-center gap-3 rounded-input border border-border px-3 py-2 transition hover:border-jungle"
              >
                {image.trim() !== "" ? (
                  <img
                    src={image}
                    alt=""
                    className="h-9 w-14 shrink-0 rounded-input bg-platinum object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-input bg-platinum text-pine/50">
                    <ImageIcon size={18} />
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-left text-sm text-pine">
                  {image.trim() !== "" ? "Trocar imagem" : "Enviar ou colar URL"}
                </span>
                <CaretDown size={16} className="shrink-0 text-pine/60" />
              </button>
              </div>
            </Field>
            <Field span={12}>
              <div className="flex items-center justify-between gap-4">
              <Label htmlFor="category-active">Visível na loja</Label>
              <Switch
                id="category-active"
                checked={active}
                onCheckedChange={setActive}
              />
              </div>
            </Field>
          </FormGrid>

          <SheetFooter className="shrink-0 flex-row justify-end border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={trimmed === ""}
              className="rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Salvar
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ResponsivePopover
        open={picker !== null}
        modal
        onOpenChange={(next) => {
          if (!next) setPicker(null);
        }}
        anchorEl={picker?.anchor ?? null}
      >
        <ResponsivePopoverContent
          aria-label={
            picker?.id === "icon"
              ? "Escolher ícone"
              : picker?.id === "tint"
                ? "Escolher cor"
                : "Enviar capa"
          }
          className={picker?.id === "cover" ? "sm:w-80" : "sm:w-72"}
        >
          {picker?.id === "icon" && (
            <>
              <ResponsivePopoverHeader>
                <ResponsivePopoverTitle>Ícone</ResponsivePopoverTitle>
              </ResponsivePopoverHeader>
              <ResponsivePopoverBody>
                <div
                  role="group"
                  aria-label="Ícone"
                  className="grid grid-cols-4 gap-2"
                >
                  {Object.entries(ICONS).map(([key, OptionIcon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setIcon(key);
                        setPicker(null);
                      }}
                      aria-pressed={icon === key}
                      aria-label={key}
                      className={`flex h-11 items-center justify-center rounded-input border transition ${
                        icon === key
                          ? "border-jungle bg-muted"
                          : "border-border hover:border-jungle"
                      }`}
                    >
                      <span className={tint}>
                        <OptionIcon size={20} />
                      </span>
                    </button>
                  ))}
                </div>
              </ResponsivePopoverBody>
            </>
          )}
          {picker?.id === "tint" && (
            <>
              <ResponsivePopoverHeader>
                <ResponsivePopoverTitle>Cor</ResponsivePopoverTitle>
              </ResponsivePopoverHeader>
              <ResponsivePopoverBody>
                <div
                  role="group"
                  aria-label="Cor"
                  className="flex items-center gap-3"
                >
                  {TINTS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTint(option.value);
                        setPicker(null);
                      }}
                      aria-pressed={tint === option.value}
                      aria-label={option.label}
                      title={option.label}
                      className={`size-8 rounded-full transition ${option.value} ${
                        tint === option.value
                          ? "ring-2 ring-jungle ring-offset-2 ring-offset-background"
                          : "hover:ring-2 hover:ring-pine/40 hover:ring-offset-2 hover:ring-offset-background"
                      }`}
                    />
                  ))}
                </div>
              </ResponsivePopoverBody>
            </>
          )}
          {picker?.id === "cover" && (
            <>
              <ResponsivePopoverHeader>
                <ResponsivePopoverTitle>Capa</ResponsivePopoverTitle>
              </ResponsivePopoverHeader>
              <ResponsivePopoverBody>
                <CoverField value={image} onChange={setImage} />
              </ResponsivePopoverBody>
            </>
          )}
        </ResponsivePopoverContent>
      </ResponsivePopover>

      <ResponsivePopover
        open={menu !== null}
        modal
        onOpenChange={(next) => {
          if (!next) setMenu(null);
        }}
        anchorEl={menu?.anchor ?? null}
      >
        <ResponsivePopoverContent
          aria-label={
            menuItem ? `Ações de ${menuItem.name}` : "Ações da categoria"
          }
          className="sm:w-60"
        >
          {menuItem && (
            <ResponsivePopoverBody className="gap-1 p-2">
              <button
                type="button"
                onClick={() => {
                  setMenu(null);
                  openEdit(menuItem);
                }}
                className="flex w-full items-center gap-2.5 rounded-input px-3 py-2 text-left text-sm text-gunmetal transition hover:bg-muted"
              >
                <PencilSimple size={16} className="shrink-0 text-pine" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleActive(menuItem.id);
                  setMenu(null);
                }}
                className="flex w-full items-center gap-2.5 rounded-input px-3 py-2 text-left text-sm text-gunmetal transition hover:bg-muted"
              >
                {menuItem.active ? (
                  <Pause size={16} className="shrink-0 text-pine" />
                ) : (
                  <Play size={16} className="shrink-0 text-pine" />
                )}
                {menuItem.active ? "Pausar" : "Ativar"}
              </button>
            </ResponsivePopoverBody>
          )}
        </ResponsivePopoverContent>
      </ResponsivePopover>
    </AdminShell>
  );
}
