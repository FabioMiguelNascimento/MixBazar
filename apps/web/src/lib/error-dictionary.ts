import { isApiError, type ApiErrorPayload } from "@repo/types";

/**
 * Dicionário de erros: mapeia CODE + field key para mensagens amigáveis (pt-BR).
 * O frontend NUNCA exibe `message` cru da API — sempre passa por aqui.
 */
type Entry = { title: string; description: string };

const CODE_MESSAGES: Record<string, Entry> = {
  CANNOT_APPLY_DISCOUNT: {
    title: "Cupom não aplicado",
    description: "Não foi possível aplicar o desconto a este pedido.",
  },
  VALIDATION_ERROR: {
    title: "Verifique os campos",
    description: "Alguns campos precisam de correção.",
  },
  UNAUTHORIZED: {
    title: "Sessão expirada",
    description: "Entre novamente para continuar.",
  },
  FORBIDDEN: {
    title: "Sem permissão",
    description: "Você não tem permissão para esta ação.",
  },
  NOT_FOUND: {
    title: "Não encontrado",
    description: "O recurso solicitado não existe.",
  },
  CONFLICT: {
    title: "Conflito",
    description: "Esta ação conflita com o estado atual.",
  },
  INTERNAL_ERROR: {
    title: "Algo deu errado",
    description: "Tente novamente em instantes.",
  },
};

const FIELD_MESSAGES: Record<string, Record<string, string>> = {
  CANNOT_APPLY_DISCOUNT: {
    discount_code: "Esse cupom é inválido ou expirou. Confira o código.",
  },
  VALIDATION_ERROR: {
    discountCode: "Use 5 a 10 letras maiúsculas ou números.",
    orderId: "Pedido inválido.",
  },
};

function normalizeKey(key: string): string {
  // API usa snake_case (discount_code), RHF usa camelCase (discountCode)
  const map: Record<string, string> = {
    discount_code: "discountCode",
    order_id: "orderId",
  };
  return map[key] ?? key;
}

export function friendlyTitle(code: string): string {
  return CODE_MESSAGES[code]?.title ?? "Algo deu errado";
}

export function friendlyDescription(code: string): string {
  return CODE_MESSAGES[code]?.description ?? "Tente novamente em instantes.";
}

/** Mensagem amigável para um campo específico, com fallback para a mensagem da API. */
export function friendlyFieldMessage(
  code: string,
  key: string,
  fallback: string,
): string {
  return (
    FIELD_MESSAGES[code]?.[key] ??
    FIELD_MESSAGES[code]?.[normalizeKey(key)] ??
    fallback
  );
}

/** Extrai ApiErrorPayload de um erro de fetch desconhecido. */
export function parseApiError(err: unknown): ApiErrorPayload | null {
  if (isApiError(err)) return err;
  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    if (isApiError(e["payload"])) return e["payload"] as ApiErrorPayload;
    if (isApiError(e["data"])) return e["data"] as ApiErrorPayload;
  }
  return null;
}
