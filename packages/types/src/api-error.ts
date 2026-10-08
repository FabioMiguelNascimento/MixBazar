/**
 * Tipos compartilhados do contrato de erro da API.
 * Formato padrão de FALHA (sempre com `success: false`):
 *
 * {
 *   success: false,
 *   code: "CANNOT_APPLY_DISCOUNT",
 *   message: "Cannot apply discount to this order.",
 *   error: [{ key, message, regex?, validation? }]
 * }
 */

export type ErrorCode =
  | "CANNOT_APPLY_DISCOUNT"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface FieldError {
  /** Nome do campo, ex: "discount_code" */
  key: string;
  /** Mensagem técnica (inglês) vinda da API */
  message: string;
  /** Regex customizada aplicável a esse erro, se houver */
  regex?: string;
  /**
   * DSL de validação legível por máquina + humano, ex:
   * "discount_code.required.min_length=5.max_length=10.format=alphanumeric"
   */
  validation?: string;
}

export interface ApiErrorPayload {
  success: false;
  code: ErrorCode | (string & {});
  message: string;
  error: FieldError[];
}

export interface ApiSuccessPayload<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessPayload<T> | ApiErrorPayload;

/** Type-guard para estreitar respostas da API no frontend. */
export function isApiError(payload: unknown): payload is ApiErrorPayload {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return p["success"] === false && typeof p["code"] === "string";
}
