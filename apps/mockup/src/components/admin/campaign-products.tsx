"use client";

import { Fragment, useState } from "react";
import { CaretDown, Plus, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { Input, Label } from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { categories, products } from "@/data/catalog";
import { formatBRL } from "@/components/admin/product-model";

export function CampaignProducts({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(categories.map((category) => category.name)),
  );
  const selected = new Set(value);
  const query = search.trim().toLowerCase();
  const suggestions =
    query === ""
      ? []
      : products
          .filter(
            (product) =>
              !selected.has(product.id) &&
              (product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)),
          )
          .slice(0, 6);

  function add(productId: string) {
    if (selected.has(productId)) return;
    onChange([...value, productId]);
  }

  function addCategory(category: string) {
    const ids = products
      .filter(
        (product) =>
          product.category === category && !selected.has(product.id),
      )
      .map((product) => product.id);
    if (ids.length === 0) return;
    onChange([...value, ...ids]);
    setExpanded((prev) => new Set(prev).add(category));
  }

  function removeCategory(category: string) {
    const inCategory = new Set(
      products
        .filter((product) => product.category === category)
        .map((product) => product.id),
    );
    onChange(value.filter((id) => !inCategory.has(id)));
  }

  function toggleCategory(category: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function byId(productId: string) {
    return products.find((product) => product.id === productId);
  }

  const groups = categories
    .map((category) => ({
      category: category.name,
      items: value
        .map((id) => byId(id))
        .filter(
          (product): product is NonNullable<typeof product> =>
            product !== undefined && product.category === category.name,
        ),
    }))
    .filter((group) => group.items.length > 0);
  const orphans = value.filter((id) => byId(id) === undefined);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <span className="text-sm font-medium">Adição rápida por categoria</span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const missing = products.filter(
              (product) =>
                product.category === category.name &&
                !selected.has(product.id),
            ).length;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => addCategory(category.name)}
                disabled={missing === 0}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-gunmetal transition hover:border-jungle disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={14} weight="bold" />
                Todas de {category.name.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="campaign-product-search">Buscar produto</Label>
        <Input
          id="campaign-product-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && suggestions.length > 0) {
              event.preventDefault();
              add(suggestions[0].id);
              setSearch("");
            }
          }}
          placeholder="Digite para buscar"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <div
            role="listbox"
            aria-label="Sugestões de produtos"
            className="grid gap-1 rounded-input border border-border bg-background p-1"
          >
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => {
                  add(product.id);
                  setSearch("");
                }}
                className="flex min-w-0 items-center gap-2.5 rounded-input px-2 py-1.5 text-left transition hover:bg-muted"
              >
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt=""
                    className="size-8 shrink-0 rounded-input bg-platinum object-cover"
                  />
                ) : (
                  <span className="size-8 shrink-0 rounded-input bg-platinum" />
                )}
                <span className="min-w-0 flex-1 truncate text-sm text-gunmetal">
                  {product.name}
                </span>
                <span className="shrink-0 text-xs text-pine/70">
                  {product.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {value.length === 0 ? (
        <p className="rounded-card border border-dashed border-border px-4 py-6 text-center text-sm text-pine/70">
          Vale para todos os produtos enquanto a lista estiver vazia.
        </p>
      ) : (
        <div className="min-w-0 overflow-x-auto">
          <Table aria-label="Produtos da campanha">
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 normal-case tracking-normal">
                  Produto
                </TableHead>
                <TableHead className="h-9 text-right normal-case tracking-normal">
                  Preço
                </TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <Fragment key={group.category}>
                  <TableRow key={group.category}>
                    <TableCell colSpan={2} className="bg-muted/40 py-1.5">
                      <span className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleCategory(group.category)}
                          aria-expanded={expanded.has(group.category)}
                          aria-label={`${expanded.has(group.category) ? "Recolher" : "Expandir"} ${group.category}`}
                          className="flex size-7 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                        >
                          <CaretDown
                            size={14}
                            weight="bold"
                            className={`transition ${expanded.has(group.category) ? "" : "-rotate-90"}`}
                          />
                        </button>
                        <span className="text-xs font-semibold text-gunmetal">
                          {group.category} · {group.items.length}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="bg-muted/40 py-1.5">
                      <span className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeCategory(group.category)}
                          aria-label={`Remover ${group.category} da campanha`}
                          className="flex size-8 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-danger-text"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </span>
                    </TableCell>
                  </TableRow>
                  {expanded.has(group.category) &&
                    group.items.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="py-2">
                          <span className="flex min-w-0 items-center gap-2.5 pl-7">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="size-8 shrink-0 rounded-input bg-platinum object-cover"
                              />
                            ) : (
                              <span className="size-8 shrink-0 rounded-input bg-platinum" />
                            )}
                            <span className="truncate text-sm font-medium text-gunmetal">
                              {product.name}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <span className="font-heading text-sm font-semibold text-gunmetal">
                            {formatBRL(product.priceValue)}
                          </span>
                        </TableCell>
                        <TableCell className="py-2">
                          <span className="flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                onChange(
                                  value.filter((id) => id !== product.id),
                                )
                              }
                              aria-label={`Remover ${product.name}`}
                              className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-danger-text"
                            >
                              <Trash size={16} />
                            </button>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              ))}
              {orphans.map((id) => (
                <TableRow key={id}>
                  <TableCell className="py-2">
                    <span className="text-sm text-pine/70">{id}</span>
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <span className="text-sm text-pine/70">—</span>
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          onChange(value.filter((entry) => entry !== id))
                        }
                        aria-label={`Remover ${id}`}
                        className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-danger-text"
                      >
                        <Trash size={16} />
                      </button>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
