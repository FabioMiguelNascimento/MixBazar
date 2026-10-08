import { isApiError } from "@repo/types";

const BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001/v1";

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
