import { createZodDto } from 'nestjs-zod';
import { applyDiscountSchema } from '@repo/contracts';

/** DTO gerado do contrato Zod — mesma fonte usada no frontend (RHF + zodResolver). */
export class ApplyDiscountDto extends createZodDto(applyDiscountSchema) {}
