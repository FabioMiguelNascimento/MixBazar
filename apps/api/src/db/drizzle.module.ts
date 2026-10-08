import { Global, Module } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export const DRIZZLE = Symbol('DRIZZLE');
export type Db = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: (): Db => {
        const url =
          process.env['DATABASE_URL'] ??
          'postgres://postgres:postgres@localhost:5432/tcc';
        const pool = new Pool({ connectionString: url });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
