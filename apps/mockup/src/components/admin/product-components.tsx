"use client";

import { useState } from "react";
import { Minus, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { discountLabel, formatBare, formatBRL, lineTotals, parseBRL, type AdminProduct, type BundleComponent } from "@/components/admin/product-model";
import {
  ButtonGroup,
  Input,
  Label,
  ResponsivePopover,
  ResponsivePopoverBody,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";

export function ProductComponents({
  catalog,
  excludeId,
  value,
  onChange,
  error,
  cheio,
  finalPrice,
  onUseSumAsPrice,
}: {
  catalog: AdminProduct[];
  excludeId: string | null;
  value: BundleComponent[];
  onChange: (next: BundleComponent[]) => void;
  error: string | null;
  cheio: number | null;
  finalPrice: number | null;
  onUseSumAsPrice: (sum: number) => void;
}) {
  const [search, setSearch] = useState("");
  const added = new Set(value.map((entry) => entry.productId));
  const query = search.trim().toLowerCase();
  const suggestions =
    query === ""
      ? []
      : catalog
          .filter(
            (product) =>
              product.id !== excludeId &&
              !added.has(product.id) &&
              product.name.toLowerCase().includes(query),
          )
          .slice(0, 6);

  function add(productId: string) {
    onChange([...value, { productId, quantity: 1, discount: null }]);
    setSearch("");
  }

  function setQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    onChange(
      value.map((entry) =>
        entry.productId === productId ? { ...entry, quantity } : entry,
      ),
    );
  }

  function remove(productId: string) {
    onChange(value.filter((entry) => entry.productId !== productId));
  }

  function byId(productId: string) {
    return catalog.find((product) => product.id === productId);
  }

  const [discountFor, setDiscountFor] = useState<{
    productId: string;
    anchor: Element;
  } | null>(null);
  const [discType, setDiscType] = useState<"percent" | "value">("percent");
  const [discAmount, setDiscAmount] = useState("");
  const [discError, setDiscError] = useState<string | null>(null);

  function openDiscount(entry: BundleComponent, anchor: Element) {
    setDiscType(entry.discount?.type ?? "percent");
    setDiscAmount(
      entry.discount ? formatBare(entry.discount.amount) : "",
    );
    setDiscError(null);
    setDiscountFor({ productId: entry.productId, anchor });
  }

  function discountGross() {
    const target = value.find(
      (entry) => entry.productId === discountFor?.productId,
    );
    const product = target ? byId(target.productId) : undefined;
    if (!target || !product) return null;
    return Math.round(product.priceValue * target.quantity * 100) / 100;
  }

  function applyDiscount() {
    const gross = discountGross();
    if (gross === null) return;
    if (discType === "percent") {
      if (!/^\d+$/.test(discAmount.trim())) {
        setDiscError("Use um número inteiro de 1 a 90.");
        return;
      }
      const amount = Number.parseInt(discAmount.trim(), 10);
      if (amount < 1 || amount > 90) {
        setDiscError("Use um número inteiro de 1 a 90.");
        return;
      }
      onChange(
        value.map((entry) =>
          entry.productId === discountFor?.productId
            ? { ...entry, discount: { type: "percent", amount } }
            : entry,
        ),
      );
      setDiscountFor(null);
      return;
    }
    const parsed = parseBRL(discAmount);
    if (parsed === null || parsed <= 0) {
      setDiscError("Informe um valor maior que zero.");
      return;
    }
    if (parsed >= gross) {
      setDiscError("O desconto precisa ser menor que o total da linha.");
      return;
    }
    onChange(
      value.map((entry) =>
        entry.productId === discountFor?.productId
          ? {
              ...entry,
              discount: {
                type: "value",
                amount: Math.round(parsed * 100) / 100,
              },
            }
          : entry,
      ),
    );
    setDiscountFor(null);
  }

  function clearDiscount() {
    onChange(
      value.map((entry) =>
        entry.productId === discountFor?.productId
          ? { ...entry, discount: null }
          : entry,
      ),
    );
    setDiscountFor(null);
  }

  const lines = value.map((entry) => ({
    entry,
    product: byId(entry.productId),
  }));
  const sum = lines.reduce(
    (total, line) =>
      total +
      (line.product
        ? lineTotals(line.product.priceValue, line.entry.quantity, line.entry.discount).net
        : 0),
    0,
  );
  const selling = finalPrice ?? cheio;
  const savings =
    selling !== null && sum > selling
      ? Math.round((sum - selling) * 100) / 100
      : 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="product-component-search">Adicionar componente</Label>
        <Input
          id="product-component-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && suggestions.length > 0) {
              event.preventDefault();
              add(suggestions[0].id);
            }
          }}
          placeholder="Digite para buscar produtos"
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
                onClick={() => add(product.id)}
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
                  {formatBRL(product.priceValue)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="min-w-0 overflow-x-auto">
          <Table aria-label="Componentes do produto">
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 normal-case tracking-normal">
                  Componente
                </TableHead>
                <TableHead className="h-9 text-center normal-case tracking-normal">
                  Qtd
                </TableHead>
                <TableHead className="h-9 text-right normal-case tracking-normal">
                  Preço un.
                </TableHead>
                <TableHead className="h-9 text-right normal-case tracking-normal">
                  Total
                </TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map(({ entry, product }) => {
                if (!product) return null;
                return (
                  <TableRow key={entry.productId}>
                    <TableCell className="py-2">
                      <span className="flex min-w-0 items-center gap-2.5">
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
                    <TableCell className="py-2">
                      <span className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(entry.productId, entry.quantity - 1)
                          }
                          disabled={entry.quantity <= 1}
                          aria-label={`Diminuir ${product.name}`}
                          className="flex size-8 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={14} weight="bold" />
                        </button>
                        <span
                          aria-label={`Quantidade de ${product.name}`}
                          className="w-6 text-center font-heading text-sm font-semibold text-gunmetal"
                        >
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(entry.productId, entry.quantity + 1)
                          }
                          aria-label={`Aumentar ${product.name}`}
                          className="flex size-8 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <span className="text-sm text-pine">
                        {formatBRL(product.priceValue)}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <button
                        type="button"
                        onClick={(event) =>
                          openDiscount(entry, event.currentTarget)
                        }
                        aria-label={`Desconto de ${product.name}`}
                        className="ml-auto block rounded-input px-1 py-0.5 text-right transition hover:bg-muted"
                      >
                        <span className="block font-heading text-sm font-semibold text-gunmetal">
                          {formatBRL(
                            lineTotals(
                              product.priceValue,
                              entry.quantity,
                              entry.discount,
                            ).net,
                          )}
                        </span>
                        <span className="block text-[11px] font-medium text-jungle">
                          {entry.discount
                            ? discountLabel(entry.discount)
                            : "+ desconto"}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => remove(entry.productId)}
                          aria-label={`Remover ${product.name}`}
                          className="flex size-9 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-danger-text"
                        >
                          <Trash size={16} />
                        </button>
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-background px-4 py-3">
            <p className="text-sm text-pine">
              Soma dos componentes{" "}
              <span className="font-heading font-semibold text-gunmetal">
                {formatBRL(sum)}
              </span>
              {savings > 0 && (
                <>
                  {" "}· cliente economiza{" "}
                  <span className="font-semibold text-jungle">
                    {formatBRL(savings)}
                  </span>
                </>
              )}
            </p>
            {sum > 0 && cheio !== sum && (
              <button
                type="button"
                onClick={() => onUseSumAsPrice(sum)}
                className="shrink-0 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-gunmetal transition hover:border-jungle"
              >
                Usar soma como preço
              </button>
            )}
          </div>
        </div>
      )}

      {error !== null && (
        <p role="alert" className="text-xs font-medium text-danger-text">
          {error}
        </p>
      )}

      <ResponsivePopover
        open={discountFor !== null}
        modal
        onOpenChange={(next) => {
          if (!next) setDiscountFor(null);
        }}
        anchorEl={discountFor?.anchor ?? null}
      >
        <ResponsivePopoverContent
          aria-label="Desconto do componente"
          className="sm:w-72"
        >
          <ResponsivePopoverHeader>
            <ResponsivePopoverTitle>Desconto</ResponsivePopoverTitle>
          </ResponsivePopoverHeader>
          <ResponsivePopoverBody>
            <div className="grid gap-2">
              <span
                id="component-discount-type-label"
                className="text-sm font-medium"
              >
                Tipo de desconto
              </span>
              <ButtonGroup
                aria-labelledby="component-discount-type-label"
                orientation="horizontal"
              >
                {(
                  [
                    { value: "percent", label: "Porcentagem" },
                    { value: "value", label: "Valor (R$)" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDiscType(option.value)}
                    aria-pressed={discType === option.value}
                    className={`shrink-0 rounded-button border px-4 py-2 text-sm font-medium transition ${
                      discType === option.value
                        ? "border-jungle bg-jungle text-platinum"
                        : "border-border bg-background text-gunmetal hover:border-jungle"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </ButtonGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="component-discount-amount">
                {discType === "percent" ? "Porcentagem (%)" : "Valor (R$)"}
              </Label>
              <Input
                id="component-discount-amount"
                value={discAmount}
                onChange={(event) => {
                  setDiscAmount(event.target.value);
                  setDiscError(null);
                }}
                placeholder={discType === "percent" ? "Ex. 10" : "Ex. 5,00"}
                inputMode="decimal"
              />
            </div>
            {discError !== null && (
              <p role="alert" className="text-xs font-medium text-danger-text">
                {discError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={clearDiscount}
                className="rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={applyDiscount}
                className="rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
              >
                Aplicar
              </button>
            </div>
          </ResponsivePopoverBody>
        </ResponsivePopoverContent>
      </ResponsivePopover>
    </div>
  );
}
