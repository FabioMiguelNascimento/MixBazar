import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

/** Tabelas de domínio (exemplo). */
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  total: integer('total').notNull().default(0),
  discountApplied: boolean('discount_applied').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const discounts = pgTable('discounts', {
  code: text('code').primaryKey(),
  active: boolean('active').notNull().default(true),
  expiresAt: timestamp('expires_at'),
});

/**
 * Tabelas mínimas do Better Auth.
 * Em produção prefira `better-auth/db` + drizzle adapter gerando o schema.
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  providerId: text('providerId').notNull(),
  accountId: text('accountId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
