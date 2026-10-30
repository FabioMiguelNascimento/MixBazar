/* ------------------------------------------------------------------ */
/* Clientes do painel — seeds fixos em memória, como o resto do mockup  */
/* ------------------------------------------------------------------ */

import { slugify } from "@/components/admin/category-model";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
};

const PEOPLE: [string, string, string | null][] = [
  ["Mariana Lopes", "(51) 99123-4567", "Rua das Flores, 123 — Centro"],
  ["João Pedro Reis", "(51) 99210-8811", null],
  ["Ana Beatriz Cruz", "(51) 98877-2013", "Av. Brasil, 456, ap. 12 — Jardim América"],
  ["Carlos Mota", "(51) 99504-3320", null],
  ["Fernanda Alves", "(51) 99631-1145", "Rua XV de Novembro, 789 — Centro"],
  ["Rafael Teixeira", "(51) 98115-7664", "Rua do Comércio, 321 — São José"],
  ["Juliana Prates", "(51) 99928-5007", null],
  ["Marcos Vinícius", "(51) 98433-9902", "Av. das Palmeiras, 654 — Vila Nova"],
  ["Patrícia Gomes", "(51) 99771-2210", null],
  ["Lucas Ferreira", "(51) 98322-1048", "Rua Tiradentes, 987 — Bela Vista"],
  ["Beatriz Rocha", "(51) 99612-7781", null],
  ["Thiago Martins", "(51) 98190-4417", "Rua São João, 147 — Floresta"],
  ["Ricardo Almeida", "(51) 99245-8060", "Av. Central, 1000, sala 301 — Centro"],
];

export function clientEmail(name: string) {
  const parts = slugify(name).split("-");
  return `${parts[0]}.${parts.at(-1)}@example.com`;
}

export const seedClients: Client[] = PEOPLE.map(([name, phone, address]) => ({
  id: slugify(name),
  name,
  email: clientEmail(name),
  phone,
  address,
}));

/** Chave de conciliação: nome sem acento, minúsculo, só palavras. */
export function clientKey(name: string) {
  return slugify(name);
}
