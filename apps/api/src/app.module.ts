import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DrizzleModule } from './db/drizzle.module.js';
import { AuthController } from './auth/auth.controller.js';
import { DiscountsController } from './modules/discounts/discounts.controller.js';
import { DiscountsService } from './modules/discounts/discounts.service.js';

@Module({
  imports: [DrizzleModule],
  controllers: [AppController, AuthController, DiscountsController],
  providers: [AppService, DiscountsService],
})
export class AppModule {}
