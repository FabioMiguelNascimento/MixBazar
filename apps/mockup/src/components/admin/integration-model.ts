/* ------------------------------------------------------------------ */
/* Integração — conciliação de planilhas no sistema (tudo em memória)  */
/* A planilha chega como texto (CSV/TSV) ou como grade de demonstração; */
/* a conciliação compara com o cadastro local e separa o que é novo,    */
/* o que atualiza e o que não passa na validação.                      */
/* ------------------------------------------------------------------ */

import type { AdminProduct } from "@/components/admin/product-model";
import { productCategories, productSlug } from "@/components/admin/product-model";
import type { Client } from "@/data/clients";
import { clientEmail, clientKey } from "@/data/clients";
import { slugify } from "@/components/admin/category-model";

export type IntegrationTarget = "clientes" | "produtos";

export const TARGET_LABEL: Record<IntegrationTarget, string> = {
  clientes: "Clientes",
  produtos: "Produtos",
};

export type SheetRow = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type ProductRow = {
  name: string;
  category: string;
  price: string;
  active: boolean;
};

export const CLIENT_HEADERS = ["Nome", "E-mail", "Telefone", "Endereço"];
export const PRODUCT_HEADERS = ["Produto", "Categoria", "Preço", "Ativo"];

export const CLIENT_SAMPLE: string[][] = [
  ["Nome", "E-mail", "Telefone", "Endereço"],
  ["Mariana Lopes", "mariana.lopes@example.com", "(51) 99123-7777", "Rua das Flores, 123 — Centro"],
  ["Sofia Andrade", "sofia.andrade@example.com", "(51) 98123-4405", "Av. Ipiranga, 80 — Santana"],
  ["Pedro Henrique Dias", "pedro.dias@example.com", "(51) 99450-1288", ""],
  ["", "sem-nome@example.com", "(51) 99000-0000", "Rua Incompleta, 1 — Centro"],
];

export const PRODUCT_SAMPLE: string[][] = [
  ["Produto", "Categoria", "Preço", "Ativo"],
  ["Caneca Artesanal", "Bazar", "38,90", "Sim"],
  ["Cesta Chocolates Gourmet", "Presentes", "94,90", "Sim"],
  ["Kit Café Especial", "Cestas", "79,90", "Não"],
  ["Cesta Sem Categoria", "", "49,90", "Sim"],
  ["Produto Preço Inválido", "Bazar", "cem reais", "Sim"],
];

/* --------------------- leitura da planilha ------------------------ */

/** Converte texto CSV/TSV em grade; a primeira linha é o cabeçalho. */
export function parseSheetText(text: string): string[][] {
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) return [];

  const first = lines[0];
  const delimiter = ["\t", ";", ","].find((option) =>
    first.includes(option),
  ) ?? ",";

  return lines.map((line) =>
    line
      .split(delimiter)
      .map((cell) => cell.trim().replace(/^"|"$/g, "")),
  );
}

/** Grade genérica (Nome, E-mail, Telefone, Endereço) → linhas. */
export function gridToSheetRows(grid: string[][]): SheetRow[] {
  const rows: SheetRow[] = [];

  for (const cells of grid.slice(1)) {
    const value = (index: number) => cells[index]?.trim() ?? "";

    rows.push({
      name: value(0),
      email: value(1),
      phone: value(2),
      address: value(3),
    });
  }

  return rows;
}

/** Grade genérica (Produto, Categoria, Preço, Ativo) → linhas. */
export function gridToProductRows(grid: string[][]): ProductRow[] {
  return grid.slice(1).map((cells) => ({
    name: cells[0]?.trim() ?? "",
    category: cells[1]?.trim() ?? "",
    price: cells[2]?.trim() ?? "",
    active: (cells[3]?.trim().toLowerCase() ?? "sim") !== "não" &&
      (cells[3]?.trim().toLowerCase() ?? "sim") !== "nao" &&
      (cells[3]?.trim().toLowerCase() ?? "sim") !== "n",
  }));
}

export function sampleSheetRows(target: IntegrationTarget): string[][] {
  return target === "clientes" ? CLIENT_SAMPLE : PRODUCT_SAMPLE;
}

/* ------------------------ conciliação ----------------------------- */

export type ClientConciliation = {
  create: Client[];
  update: {
    id: string;
    name: string;
    fields: string[];
    patch: { email: string; phone: string; address: string };
  }[];
  errors: { line: number; text: string }[];
};

const FIELD_LABEL: Record<string, string> = {
  email: "e-mail",
  phone: "telefone",
  address: "endereço",
};

export function conciliateClientes(
  existing: Client[],
  rows: SheetRow[],
): ClientConciliation {
  const result: ClientConciliation = { create: [], update: [], errors: [] };

  for (const [index, row] of rows.entries()) {
    if (row.name.trim() === "") {
      result.errors.push({
        line: index + 2,
        text: "Linha sem nome — informe quem é o cliente.",
      });
      continue;
    }

    const match = existing.find(
      (client) =>
        clientKey(client.name) === clientKey(row.name) ||
        (row.email !== "" && client.email === row.email.toLowerCase()),
    );

    if (match === undefined) {
      result.create.push({
        id: clientKey(row.name),
        name: row.name.trim(),
        email: row.email.trim() || clientEmail(row.name),
        phone: row.phone.trim(),
        address: row.address.trim() === "" ? null : row.address.trim(),
      });
      continue;
    }

    const fields = [
      row.phone.trim() !== "" && row.phone.trim() !== match.phone
        ? "phone"
        : null,
      row.email.trim() !== "" && row.email.toLowerCase() !== match.email
        ? "email"
        : null,
      row.address.trim() !== "" && row.address.trim() !== match.address
        ? "address"
        : null,
    ].filter((field): field is string => field !== null);

    if (fields.length > 0) {
      result.update.push({
        id: match.id,
        name: match.name,
        fields: fields.map((field) => FIELD_LABEL[field] ?? field),
        patch: {
          email: row.email.trim().toLowerCase(),
          phone: row.phone.trim(),
          address: row.address.trim(),
        },
      });
    }
  }

  return result;
}

export type ProductConciliation = {
  create: Omit<AdminProduct, "id">[];
  update: {
    id: string;
    name: string;
    fields: string[];
    patch: { priceValue: number; active: boolean };
  }[];
  errors: { line: number; text: string }[];
};

export function conciliateProdutos(
  existing: AdminProduct[],
  rows: ProductRow[],
): ProductConciliation {
  const result: ProductConciliation = { create: [], update: [], errors: [] };

  for (const [index, row] of rows.entries()) {
    if (row.name.trim() === "") {
      result.errors.push({
        line: index + 2,
        text: "Linha sem nome — informe o produto.",
      });
      continue;
    }

    if (!Number.isFinite(parseSheetPrice(row.price))) {
      result.errors.push({
        line: index + 2,
        text: `"${row.name}" tem preço inválido ("${row.price}").`,
      });
      continue;
    }

    if (row.category !== "") {
      if (!productCategories.includes(row.category)) {
        result.errors.push({
          line: index + 2,
          text: `"${row.name}" usa a categoria "${row.category}", que não existe no painel.`,
        });
        continue;
      }
    }

    const price = parseSheetPrice(row.price);
    const match = existing.find(
      (product) => slugify(product.name) === slugify(row.name),
    );

    if (match === undefined) {
      result.create.push({
        name: row.name.trim(),
        category: row.category || "Bazar",
        priceValue: price,
        oldPriceValue: null,
        badge: null,
        description: "",
        images: [],
        active: row.active,
        composite: false,
        components: [],
      });
      continue;
    }

    const fields = [
      price !== match.priceValue ? "priceValue" : null,
      !row.active !== !match.active ? "active" : null,
    ].filter((field): field is string => field !== null);

    if (fields.length > 0) {
      result.update.push({
        id: match.id,
        name: match.name,
        fields: fields.map((field) => FIELD_LABEL_ATUALIZAR[field] ?? field),
        patch: { priceValue: price, active: row.active },
      });
    }
  }

  return result;
}

const FIELD_LABEL_ATUALIZAR: Record<string, string> = {
  priceValue: "preço",
  active: "ativo",
};

function parseSheetPrice(text: string) {
  const normalized = text
    .trim()
    .replace(/[^\d,.]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  return Number.parseFloat(normalized);
}

