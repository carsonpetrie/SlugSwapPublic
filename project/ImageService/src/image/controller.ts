import {
  Request,
  Controller,
  Post,
  Route,
  Res,
  TsoaResponse,
} from 'tsoa';
import multer, { Multer } from 'multer';
import e from 'express';
import { ImageService } from './service';

@Route('image')
export class ImageController extends Controller {
  private upload: Multer = multer({
    fileFilter: (_req, file, cb) => {
      const mimeTypeRegex = /^image\/(png|jpg|jpeg|webp)$/;
      if (mimeTypeRegex.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg, .jpeg, and .webp format allowed!'));
      }
    },
    limits: {
      fileSize: 3 * 1024 * 1024 // 3 mebibytes per file
    },
    storage: multer.memoryStorage(),
  })

  @Post('listing')
  public async post(
    @Request() req: Express.Request,
    @Res() badRequestResponse: TsoaResponse<400, { reason: string }>,
  ): Promise<{fileName: string}> {
    //console.log(req);
    return new Promise((resolve, reject) => {
      this.handleFile(req)
        .then(() => {
          // https://stackoverflow.com/questions/56491896/using-multer-and-express-with-typescript
          if (req.file) {
            new ImageService().imgToWebp(req.file.buffer, 'listing')
              .then((fileName) =>{
                resolve({fileName})
              })
              .catch((error) => {
                reject (badRequestResponse(400, { reason: error.message }));
              });
          } else {
            reject (badRequestResponse(400, { reason: 'No file submitted!' }));
          }
        })
        .catch((error) => {
          reject (badRequestResponse(400, { reason: error.message }));
        });
    });
  }

  private handleFile(req: Express.Request): Promise<void> {
    const multerSingle = this.upload.single("image");
    return new Promise((resolve, reject) => {
      multerSingle(req as e.Request, {} as e.Response, async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}

