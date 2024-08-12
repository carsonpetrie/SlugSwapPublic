import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();
if(process.env.NODE_ENV==='test') {
  process.env.POSTGRES_DB='test';
}

export const env = cleanEnv(process.env, {
  POSTGRES_HOST_MESSAGE: str({default: ('localhost')}),
  POSTGRES_DB: str(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
})
