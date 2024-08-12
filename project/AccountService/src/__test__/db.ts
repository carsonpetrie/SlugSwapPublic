import {Pool} from 'pg';
import * as fs from 'fs';
import { env } from '../env';

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

const run = async (file: string) => {
  const content = fs.readFileSync(file, 'utf8');
  const statements = content.split(/\r?\n/);
  for (const statement of statements) {
    if (statement) {
      await pool.query(statement);
    }
  }
};

const reset = async () => {
  await run('sql/schema.sql');
  await run('sql/data.sql');
};

const shutdown = async () => {
  await pool.end()
};
 
export {reset, shutdown};
