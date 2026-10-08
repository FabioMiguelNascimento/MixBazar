import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';
import { ZodValidationException } from 'nestjs-zod';
import { AppError, toApiErrorPayload } from '@repo/utils';
import type { ApiErrorPayload } from '@repo/types';

/**
 * Converte TUDO para o formato padrão:
 * { success: false, code, message, error: [{ key, message, regex?, validation? }] }
 */
@Catch()
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // 1) Erro de negócio lançado via createAppError / Errors.*
    if (exception instanceof AppError) {
      const payload = exception.toJSON();
      return res.status(exception.status).json(payload);
    }

    // 2) nestjs-zod: DTO inválido (ZodValidationPipe global)
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      const payload: ApiErrorPayload =
        zodError instanceof ZodError
          ? {
              success: false,
              code: 'VALIDATION_ERROR',
              message: 'Validation failed.',
              error: zodError.issues.map((i) => ({
                key: i.path.join('.') || 'root',
                message: i.message,
                validation: i.path.join('.') || 'root',
              })),
            }
          : {
              success: false,
              code: 'VALIDATION_ERROR',
              message: 'Validation failed.',
              error: [],
            };
      return res.status(400).json(payload);
    }

    // 3) Zod lançado direto (ex: schema.parse manual)
    if (exception instanceof ZodError) {
      const payload: ApiErrorPayload = {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed.',
        error: exception.issues.map((i) => ({
          key: i.path.join('.') || 'root',
          message: i.message,
          validation: i.path.join('.') || 'root',
        })),
      };
      return res.status(400).json(payload);
    }

    // 4) HttpException do Nest
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const payload: ApiErrorPayload = {
        success: false,
        code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
        message:
          typeof body === 'string'
            ? body
            : ((body as Record<string, unknown>)['message'] as string) ??
              exception.message,
        error: [],
      };
      return res.status(status).json(payload);
    }

    // 5) Qualquer outra coisa
    const payload = toApiErrorPayload(exception);
    return res.status(HttpStatus.BAD_REQUEST).json(payload);
  }
}
