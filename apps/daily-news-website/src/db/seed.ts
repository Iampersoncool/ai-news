import { seed } from 'drizzle-seed';
import { articlesTable } from './schema';
import db from '.';

await seed(db, { articlesTable });
