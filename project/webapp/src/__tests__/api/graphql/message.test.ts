import http from 'http'
import supertest from 'supertest';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';
import requestHandler from './requestHandler'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const handlers = [
  rest.post('http://localhost:3010/api/v0/auth/check', async (req, res, ctx) => {
    const token = await req.json();
    return token.encryptedToken === 'fail' ? 
      res(
        ctx.status(200),
        ctx.json({
          "userid": "a9c1e134-348e-4ba2-8e90-0add70cd512d",
          "name": "BAD PERSON",
        })
      )
      : 
      res(
        ctx.status(200),
        ctx.json({
          "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
          "name": "Molly Member",
        })
      )
  }),
  rest.post('http://localhost:3015/api/v0/chat/createChat', async (req, res, ctx) => {
    const body = await req.json();
    return body.listingID==='5b99630e-173e-4e07-bced-88647c5ce9f1' ? 
      res(
        ctx.status(200),
        ctx.json({
          "chatid": "c5f4a28f-6ff9-4cf1-b7ef-ad8451431e23",
        })
      )
      :
      res(
        ctx.status(400),
      )
  }),
  rest.post('http://localhost:3015/api/v0/chat/getChats', async (req, res, ctx) => {
    const body = await req.json();
    return body.requesterID==='aa327113-09b9-4e25-9c9e-93ad397eee9d' ? 
      res(
        ctx.status(200),
        ctx.json([
          {
            "chatid": "cd537b1e-28f6-4c4d-b6b5-e5ed0c26f967",
            "inquirerid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "listingid": "dcace0da-93d0-47ac-a601-bbb664fd5fcf",
            "ownerid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "lastUsed": "2023-03-16T09:04:04.884657+00:00",
              "createdAt": "2023-03-16T09:04:04.884657+00:00"
            },
          },
          {
            "chatid": "c99ba160-406f-49b1-8603-acf54cbdb943",
            "inquirerid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
            "ownerid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "lastUsed": "2023-03-15T23:18:14.007236+00:00",
              "createdAt": "2023-03-15T23:18:14.007236+00:00"
            },
          },
        ])
      )
      :
      res(
        ctx.status(500),
      )
  }),
  rest.post('http://localhost:3015/api/v0/chat/getChatInfo', async (req, res, ctx) => {
    const body = await req.json();
    return body.requesterID==='aa327113-09b9-4e25-9c9e-93ad397eee9d' ? 
      res(
        ctx.status(200),
        ctx.json({
          "chatid": "cd537b1e-28f6-4c4d-b6b5-e5ed0c26f967",
          "inquirerid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
          "listingid": "dcace0da-93d0-47ac-a601-bbb664fd5fcf",
          "ownerid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
          "data": {
            "lastUsed": "2023-03-16T09:04:04.884657+00:00",
            "createdAt": "2023-03-16T09:04:04.884657+00:00"
          },
        })
      )
      :
      res(
        ctx.status(500),
      )
  }),
  rest.post('http://localhost:3015/api/v0/chat/history', async (req, res, ctx) => {
    const body = await req.json();
    return body.requesterID==='aa327113-09b9-4e25-9c9e-93ad397eee9d' ? 
      res(
        ctx.status(200),
        ctx.json([
          {
            "chatid": "c99ba160-406f-49b1-8603-acf54cbdb943",
            "data": {
              "message": "Is this available?",
              "sentAt": "2023-03-15T23:18:47.007236+00:00"
            },
            "messageid": "f5b46a4b-54f3-4545-b3b9-1b3bc0d5ce31",
            "senderid": "aa327113-09b9-4e25-9c9e-93ad397eee9d"
          }
        ])
      )
      :
      res(
        ctx.status(500),
      )
  }),
  rest.post('http://localhost:3015/api/v0/message/send', async (req, res, ctx) => {
    const body = await req.json();
    return body.requesterID==='aa327113-09b9-4e25-9c9e-93ad397eee9d' ? 
      res(
        ctx.status(200),
        ctx.json({
          "chatid": "c99ba160-406f-49b1-8603-acf54cbdb943",
          "data": {
            "message": "No?",
            "sentAt": "2023-03-16T21:18:47.007236+00:00"
          },
          "messageid": "85d85145-9fb5-4b2d-a775-81fbb221c419",
          "senderid": "aa327113-09b9-4e25-9c9e-93ad397eee9d"
        })
      )
      :
      res(
        ctx.status(500),
      )
  }),
]

const mswServer = setupServer(...handlers);

beforeAll( async () => {
  server = http.createServer(requestHandler);
  server.listen();
  mswServer.listen();
  request = supertest(server);
});

afterEach(() => mswServer.restoreHandlers());

afterAll((done) => {
  server.close(done);
  mswServer.close();
});

test('PASS: CreateChat', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 
      `mutation CreateChat { ` +
        `CreateChat(listingID: "5b99630e-173e-4e07-bced-88647c5ce9f1") { ` +
          `chatid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.CreateChat).toBeDefined();
      expect(res.body.data.CreateChat.chatid).toBeDefined();
      expect(res.body.data.CreateChat.chatid).toEqual('c5f4a28f-6ff9-4cf1-b7ef-ad8451431e23');
    });
})

test('FAIL: CreateChat', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 
      `mutation CreateChat { ` +
        `CreateChat(listingID: "db5db47a-b00f-4aaa-82b5-4f48eb11bd5f") { ` +
          `chatid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
})

test('PASS: GetChats', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 
      `query GetChats { ` +
        `GetChats { ` +
          `chatid ` +
          `inquirerid ` +
          `listingid ` +
          `ownerid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.GetChats).toBeDefined();
      expect(res.body.data.GetChats.length).toEqual(2);
    });
})

test('FAIL: GetChats', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer fail')
    .send({query: 
      `query GetChats { ` +
        `GetChats { ` +
          `chatid ` +
          `inquirerid ` +
          `listingid ` +
          `ownerid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
})

test('PASS: GetChatInfo', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 
      `query GetChatInfo { ` +
        `GetChatInfo(chatID: "cd537b1e-28f6-4c4d-b6b5-e5ed0c26f967") { ` +
          `chatid ` +
          `inquirerid ` +
          `listingid ` +
          `ownerid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.GetChatInfo).toBeDefined();
    });
})

test('FAIL: GetChatInfo', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer fail')
    .send({query: 
      `query GetChatInfo { ` +
        `GetChatInfo(chatID: "cd537b1e-28f6-4c4d-b6b5-e5ed0c26f967") { ` +
          `chatid ` +
          `inquirerid ` +
          `listingid ` +
          `ownerid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
})

test('PASS: GetChatHistory', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 
      `query GetChatHistory { ` +
        `GetChatHistory(chatID: "c99ba160-406f-49b1-8603-acf54cbdb943") { ` +
          `chatid ` +
          `data { ` +
            `message ` +
            `sentAt ` +
          `} ` +
          `messageid ` +
          `senderid ` +
        `} ` + 
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.GetChatHistory).toBeDefined();
      expect(res.body.data.GetChatHistory.length).toEqual(1);
    });
})

test('FAIL: GetChatHistory', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer fail')
    .send({query: 
      `query GetChatHistory { ` +
        `GetChatHistory(chatID: "c99ba160-406f-49b1-8603-acf54cbdb943") { ` +
          `chatid ` +
          `data { ` +
            `message ` +
            `sentAt ` +
          `} ` +
          `messageid ` +
          `senderid ` +
        `} ` + 
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
})

test('PASS: SendMessage', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 
      `mutation SendMessage { ` +
        `SendMessage(chatID: "c99ba160-406f-49b1-8603-acf54cbdb943", message: "Pass") { ` +
          `chatid ` +
          `data { ` +
            `message ` +
            `sentAt ` +
          `} ` +
          `messageid ` +
          `senderid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.SendMessage).toBeDefined();
    });
})

test('FAIL: SendMessage', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer fail')
    .send({query: 
      `mutation SendMessage { ` +
        `SendMessage(chatID: "c99ba160-406f-49b1-8603-acf54cbdb943", message: "FAILURE") { ` +
          `chatid ` +
          `data { ` +
            `message ` +
            `sentAt ` +
          `} ` +
          `messageid ` +
          `senderid ` +
        `} ` +
      `}`
    })
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
})

