import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module.js';
import { AppErrorFilter } from './common/filters/app-error.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('v1');
  // Pipe global do nestjs-zod: valida todo DTO criado via createZodDto()
  // e lança ZodValidationException, que o AppErrorFilter converte
  // para o formato { success: false, code, message, error[] }.
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AppErrorFilter());
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
