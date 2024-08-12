import fs from 'fs';
import app from './app';

import { env } from './env'

fs.mkdirSync(`${env.IMAGE_OUTPUT_FOLDER}/listing`, { recursive: true });

app.listen(3011, () => {
  console.log(`Server Running on port 3011`);
  console.log('API Testing UI: http://localhost:3011/api/v0/docs/');
});