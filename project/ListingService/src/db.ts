import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  host: env.POSTGRES_HOST_LISTING,
  port: 5435,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

export { pool };
