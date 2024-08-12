import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  host: env.POSTGRES_HOST_CATEGORY,
  port: 5434,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

export { pool };
