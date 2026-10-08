import { z } from "zod";

/**
 * Contrato de aplicação de desconto.
 * Usado no frontend (react-hook-form + zodResolver) e no backend (ZodValidationPipe).
 */
export const DISCOUNT_CODE_REGEX = "^[A-Z0-9]{5,10}$";

export const applyDiscountSchema = z.object({
  orderId: z.string().uuid({ message: "orderId must be a valid UUID." }),
  discountCode: z
    .string()
    .min(5, { message: "The discount code is invalid or has expired." })
    .max(10, { message: "The discount code is invalid or has expired." })
    .regex(/^[A-Z0-9]{5,10}$/, {
      message: "The discount code is invalid or has expired.",
    }),
});

export type ApplyDiscountInput = z.infer<typeof applyDiscountSchema>;

/** Metadados de validação no padrão `key.rule.param` usado no FieldError.validation */
export function discountValidationDsl(): string {
  return "discount_code.required.min_length=5.max_length=10.format=alphanumeric";
}
