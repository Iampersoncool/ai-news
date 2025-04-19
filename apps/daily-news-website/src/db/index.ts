import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import env from '~/utils/env';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle({
  client: pool,
  logger: process.env.NODE_ENV !== 'production',
});

export default db;
