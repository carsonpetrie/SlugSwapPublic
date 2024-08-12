import supertest from 'supertest';
import * as http from 'http';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Must be ths way round 
import * as db from './db';
import app from '../app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const handlers = [
  rest.get('http://localhost:3014/api/v0/listing/get/*', async (req, res, ctx) => {
    if (req.url.pathname.includes("052880e4-adc3-46b8-bc62-43b373cf93f4")) {
      return res(
        ctx.status(200),
        ctx.json({
          "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
        })
      )
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Listing Not Found`
        })
      )
    }
  }),
]

const mswServer = setupServer(...handlers);

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  mswServer.listen(/* { onUnhandledRequest: "bypass" } */);
  await db.reset();
})

afterEach(() => mswServer.restoreHandlers());

afterAll(async () => {
  server.close();
  mswServer.close();
  await db.shutdown(); 
})

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});

test('GET All', async () => {
  await request.post('/api/v0/chat/getChats')
    .send({requesterID: "0874daf0-5b0d-4c91-be85-1b88acd226d6"})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(3);
    })
});

test('GET CHAT INFO', async () => {
  await request.post('/api/v0/chat/getChatInfo')
    .send({requesterID: "0874daf0-5b0d-4c91-be85-1b88acd226d6", chatID: "c99ba160-406f-49b1-8603-acf54cbdb943"})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.chatid).toBeDefined();
      expect(res.body.listingid).toBeDefined();
      expect(res.body.ownerid).toBeDefined();
      expect(res.body.inquirerid).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.lastUsed).toBeDefined();
    })
});

test('GET CHAT INFO NOT ALLOWED', async () => {
  await request.post('/api/v0/chat/getChatInfo')
    .send({requesterID: "0874daf0-5b0d-4c91-be85-1b88acd226d6", chatID: "5b866978-d944-498c-aec9-01abe298614c"})
    .expect(400)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    })
});

test('Create Chat', async () => {
  await request.post('/api/v0/chat/createChat')
    .send({inquirerID: "096ffc03-d23e-4c7f-a07c-47c084b34d9b", listingID: "052880e4-adc3-46b8-bc62-43b373cf93f4"})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.chatid).toBeDefined();
    })
})

test('Create Chat Fail', async () => {
  await request.post('/api/v0/chat/createChat')
    .send({inquirerID: "0874daf0-5b0d-4c91-be85-1b88acd226d6", listingID: "67c152e4-42d2-4022-8aaf-f1b6ea5c599c"})
    .expect(400)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    })
})

test('Create Chat With Self Fail', async () => {
  await request.post('/api/v0/chat/createChat')
    .send({inquirerID: "0874daf0-5b0d-4c91-be85-1b88acd226d6", listingID: "052880e4-adc3-46b8-bc62-43b373cf93f4"})
    .expect(400)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    })
})


test('GET History', async () => {
  await request.post('/api/v0/chat/history')
    .send({
      chatID: "c99ba160-406f-49b1-8603-acf54cbdb943",
      requesterID: "0874daf0-5b0d-4c91-be85-1b88acd226d6"
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(1);
    });
});

