import { Body, Controller, Post } from '@nestjs/common';
import { ApplyDiscountDto } from './dto/apply-discount.dto.js';
import { DiscountsService } from './discounts.service.js';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discounts: DiscountsService) {}

  /**
   * Validado automaticamente pelo ZodValidationPipe global (nestjs-zod)
   * a partir do schema de @repo/contracts. Falhas viram
   * ZodValidationException -> AppErrorFilter -> VALIDATION_ERROR padronizado.
   */
  @Post('apply')
  apply(@Body() body: ApplyDiscountDto) {
    return this.discounts.apply(body);
  }
}
