import { isApiError } from "@repo/types";

// Mesma origem por padrão: em produção /api é servido pelo serviço api
// (rewrite da Vercel); localmente, pelo proxy do next.config.ts.
// Defina NEXT_PUBLIC_API_URL apenas para apontar para outra origem.
const BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "/api/v1";

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    // Lança o payload padronizado para o dicionário tratar
    if (isApiError(json)) throw json;
    throw {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Unexpected error.",
      error: [],
    };
  }
  return (json as { success: true; data: T }).data ?? (json as T);
}
