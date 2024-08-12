import fs from 'fs';
import path from 'path';
import { env } from '../env';

export const createTestingFolder = async() => {
  const testImageDirectory = env.IMAGE_OUTPUT_FOLDER;
  fs.mkdirSync(path.join(testImageDirectory, '/listing'), { recursive: true });
}

export const deleteTestingFolderContents = async() => {
  const testImageDirectory = env.IMAGE_OUTPUT_FOLDER;
  const file = fs.openSync(path.join(testImageDirectory, '/listing', '.placeholder'), 'w');
  fs.closeSync(file);
  // ^ ensures there is at least one file in files for coverage
  const files = fs.readdirSync(path.join(testImageDirectory, '/listing'));
  for (const file of files) {
    fs.unlinkSync(path.join(testImageDirectory, '/listing', file));
  }
}
