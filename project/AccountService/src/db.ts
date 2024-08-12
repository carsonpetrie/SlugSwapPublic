import { Pool } from 'pg';
import { env } from './env'

const pool = new Pool({
  host: env.POSTGRES_HOST_ACCOUNT,
  port: 5433,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

export { pool };
