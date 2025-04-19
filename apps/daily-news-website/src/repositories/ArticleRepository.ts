import db from '~/db';
import { gte } from 'drizzle-orm';
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

  public static findArticlesAfterDate(date: Date, limit: number = 10) {
    return db
      .select()
      .from(articlesTable)
      .where(gte(articlesTable.createdAt, date))
      .limit(limit);
  }
}
