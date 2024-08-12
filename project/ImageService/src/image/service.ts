import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { env } from '../env';

export class ImageService {
  public async imgToWebp(imageBuffer: Buffer, directory: string): Promise<string> {
    const formatReg = /^jpg|jpeg|png|webp$/;
    return new Promise((resolve, reject) => {
      const fileName = randomUUID() + '.webp';
      const image = sharp(imageBuffer);
      image.metadata()
        .then((metadata) => {
          const format = metadata.format as string;
          if (!formatReg.test(format)) {
            return reject (new Error('Only .png, .jpg, .jpeg, and .webp format allowed!'));

          }
          image
            .rotate().webp().toFile(`${env.IMAGE_OUTPUT_FOLDER}/${directory}/${fileName}`)
            .then(()=>{
              return resolve(fileName);
            });
        })
        .catch(()=>{
          return reject (new Error('Only .png, .jpg, .jpeg, and .webp format allowed!'));
        });
    });
  }
}
