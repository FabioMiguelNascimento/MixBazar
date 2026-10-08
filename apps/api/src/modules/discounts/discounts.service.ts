import { Injectable } from '@nestjs/common';
import { Errors } from '@repo/utils';
import type { ApplyDiscountInput } from '@repo/contracts';

/**
 * Exemplo didático do padrão de erro customizado.
 * Regra fictícia: só o cupom "SAVE10" é válido; qualquer outro lança
 * CANNOT_APPLY_DISCOUNT no formato padrão.
 */
@Injectable()
export class DiscountsService {
  async apply(input: ApplyDiscountInput) {
    if (input.discountCode !== 'SAVE10') {
      throw Errors.cannotApplyDiscount();
    }
    return {
      success: true as const,
      data: { orderId: input.orderId, discountCode: input.discountCode },
    };
  }
}
