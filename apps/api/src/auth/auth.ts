import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';

const pool = new Pool({
  connectionString:
    process.env['DATABASE_URL'] ??
    'postgres://postgres:postgres@localhost:5432/tcc',
});

const db = drizzle(pool, { schema });

/**
 * Better Auth centralizado. As rotas são expostas via AuthController
 * que encaminha /v1/auth/* para `auth.handler`.
 */
export const auth = betterAuth({
  baseURL: process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3001',
  secret: process.env['BETTER_AUTH_SECRET'] ?? 'dev-secret-troque-em-producao',
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: true }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env['WEB_URL'] ?? 'http://localhost:3000'],
});

export type Auth = typeof auth;
