import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiErrorPayload } from "@repo/types";
import { friendlyFieldMessage } from "./error-dictionary";

/**
 * Aplica os `error[]` da API em um react-hook-form via setError,
 * já traduzidos pelo dicionário. Retorna as chaves que não tinham
 * campo correspondente (para exibir como toast/banner).
 */
export function applyApiErrorsToForm<T extends FieldValues>(
  payload: ApiErrorPayload,
  setError: UseFormSetError<T>,
): string[] {
  const orphans: string[] = [];
  for (const item of payload.error) {
    const friendly = friendlyFieldMessage(payload.code, item.key, item.message);
    // Converte discount_code -> discountCode para casar com o nome do field
    const path = (
      item.key === "discount_code" ? "discountCode" : item.key
    ) as Path<T>;
    try {
      setError(path, { type: "server", message: friendly });
    } catch {
      orphans.push(friendly);
    }
  }
  return orphans;
}
