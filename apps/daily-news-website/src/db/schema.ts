import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export type ArticleSelect = typeof articlesTable.$inferSelect;
export type ArticlesInsert = typeof articlesTable.$inferInsert;

export const articlesTable = pgTable('articles', {
  id: serial().primaryKey(),
  summary: text().notNull(),
  model: varchar({ length: 45 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
