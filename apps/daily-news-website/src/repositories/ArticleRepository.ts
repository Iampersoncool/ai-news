import db from '~/db';
import { desc } from 'drizzle-orm';
import { articlesTable, type ArticlesInsert } from '~/db/schema';

export default class ArticleRepository {
  public static insertOne(article: ArticlesInsert) {
    return db.insert(articlesTable).values(article).returning();
  }

  public static insertMany(articles: ArticlesInsert[]) {
    return db.insert(articlesTable).values(articles).returning();
  }

  public static findMany(limit: number) {
    return db.select().from(articlesTable).limit(limit);
  }

  public static orderByDescending(limit: number) {
    return db
      .select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.id))
      .limit(limit);
  }
}
