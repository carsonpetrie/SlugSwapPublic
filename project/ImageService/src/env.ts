import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();
if(process.env.NODE_ENV==='test') {
  process.env.IMAGE_OUTPUT_FOLDER='./images/__test__';
}

export const env = cleanEnv(process.env, {
  IMAGE_OUTPUT_FOLDER: str({default: './images'}),
})
