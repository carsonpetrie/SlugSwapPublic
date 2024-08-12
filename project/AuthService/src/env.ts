import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();
if(process.env.NODE_ENV==='test') {
  process.env.JWT_SECRET_KEY='test';
}

export const env = cleanEnv(process.env, {
  JWT_SECRET_KEY: str(),
})
