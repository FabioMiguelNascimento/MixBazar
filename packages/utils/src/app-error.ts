import type { ApiErrorPayload, FieldError } from "@repo/types";

/**
 * Erro padrão da aplicação.
 *
 * Uso:
 * ```ts
 * throw createAppError({
 *   code: "CANNOT_APPLY_DISCOUNT",
 *   message: "Cannot apply discount to this order.",
 *   status: 409,
 *   error: [{
 *     key: "discount_code",
 *     message: "The discount code is invalid or has expired.",
 *     regex: "^[A-Z0-9]{5,10}$",
 *     validation: "discount_code.required.min_length=5.max_length=10.format=alphanumeric",
 *   }],
 * });
 * ```
 */
export interface CreateAppErrorOptions {
  code: ApiErrorPayload["code"];
  message: string;
  /** HTTP status correspondente (default 400) */
  status?: number;
  error?: FieldError[];
}

export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details: FieldError[];

  constructor(options: CreateAppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.status = options.status ?? 400;
    this.details = options.error ?? [];
  }

  toJSON(): ApiErrorPayload {
    return {
      success: false,
      code: this.code,
      message: this.message,
      error: this.details,
    };
  }
}

/** Factory — forma recomendada de lançar erros de negócio na API. */
export function createAppError(options: CreateAppErrorOptions): AppError {
  return new AppError(options);
}

/** Atalho imperativo (mesmo efeito do throw createAppError, mas como função void). */
export function throwAppError(options: CreateAppErrorOptions): never {
  throw createAppError(options);
}

/** Helpers pré-montados para os códigos mais comuns. */
export const Errors = {
  cannotApplyDiscount(detail?: Partial<FieldError>): AppError {
    return createAppError({
      code: "CANNOT_APPLY_DISCOUNT",
      message: "Cannot apply discount to this order.",
      status: 409,
      error: [
        {
          key: "discount_code",
          message: "The discount code is invalid or has expired.",
          regex: "^[A-Z0-9]{5,10}$",
          validation: "discount_code.required.min_length=5.max_length=10.format=alphanumeric",
          ...detail,
        },
      ],
    });
  },

  validation(details: FieldError[], message = "Validation failed."): AppError {
    return createAppError({
      code: "VALIDATION_ERROR",
      message,
      status: 400,
      error: details,
    });
  },

  notFound(message = "Resource not found."): AppError {
    return createAppError({
      code: "NOT_FOUND",
      message,
      status: 404,
      error: [],
    });
  },
};

/** Serializa qualquer erro desconhecido para o formato ApiErrorPayload. */
export function toApiErrorPayload(err: unknown): ApiErrorPayload {
  if (err instanceof AppError) return err.toJSON();
  if (err instanceof Error) {
    return {
      success: false,
      code: "INTERNAL_ERROR",
      message: err.message || "Unexpected error.",
      error: [],
    };
  }
  return {
    success: false,
    code: "INTERNAL_ERROR",
    message: "Unexpected error.",
    error: [],
  };
}
