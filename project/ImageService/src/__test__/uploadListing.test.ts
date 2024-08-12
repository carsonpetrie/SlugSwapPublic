import supertest from 'supertest';
import * as http from 'http';
import app from '../app';

import { createTestingFolder, deleteTestingFolderContents } from './files';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

jest.setTimeout(5000);

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  createTestingFolder();
  deleteTestingFolderContents();
  return;
});

afterAll(async () => {
  server.close();
  return;
});

test('GET Invalid URL', async () => {
  await request.get('/api/v0/DOESnotEXIST')
    .expect(404);
})

test('GET API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
})

test('Success: Upload image', async () => {
  await request.post('/api/v0/image/listing')
    .attach('image', './src/__test__/testpic.jpg')
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.fileName).toBeDefined();
    })
})

it('Should Reject: Upload image TOO BIG', async () => {
  await request.post('/api/v0/image/listing')
    .attach('image', './src/__test__/testpicbig.jpg')
    .expect(400)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
      expect(res.body.reason).toEqual('File too large');
    });
})

it('Should Reject: non image disguised as image', async () => {
  await request.post('/api/v0/image/listing')
    .attach('image', './src/__test__/nonImage.txt')
    .expect(400)    
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
      expect(res.body.reason).toEqual('Only .png, .jpg, .jpeg, and .webp format allowed!');
    });
})

it('Should Reject: Real image disguised as acceptable image', async () => {
  await request.post('/api/v0/image/listing')
    .attach('image', './src/__test__/testpic.tiff', {contentType: 'image/png'})
    .expect(400)    
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
      expect(res.body.reason).toEqual('Only .png, .jpg, .jpeg, and .webp format allowed!');
    });
})

it('Should Reject: non image disguised as image', async () => {
  await request.post('/api/v0/image/listing')
    .attach('image', './src/__test__/NOTanIMAGE.txt', {contentType: 'image/png'})
    .expect(400)    
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
      expect(res.body.reason).toEqual('Only .png, .jpg, .jpeg, and .webp format allowed!');
    });
})


it('Should Reject: No file', async () => {
  await request.post('/api/v0/image/listing')
    .expect(400)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
      expect(res.body.reason).toEqual('No file submitted!');
    });
})
