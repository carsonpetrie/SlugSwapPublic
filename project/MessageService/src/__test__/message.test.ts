import supertest from 'supertest'
import * as http from 'http'

// Must be ths way round 
import * as db from './db'
import app from '../app'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
let request: supertest.SuperTest<supertest.Test>

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  await db.reset();
})

afterAll(async () => {
  server.close();
  await db.shutdown(); 
})

test('Send Message', async () => {
  await request.post('/api/v0/message/send')
    .send({
      chatID: "c99ba160-406f-49b1-8603-acf54cbdb943",
      requesterID: "0874daf0-5b0d-4c91-be85-1b88acd226d6",
      message: "Yes It Is"
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.chatid).toBeDefined();
      expect(res.body.messageid).toBeDefined();
      expect(res.body.senderid).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.message).toBeDefined();
      expect(res.body.data.sentAt).toBeDefined();
    });
})

test('Send Message Invalid', async () => {
  await request.post('/api/v0/message/send')
    .send({
      chatID: "ab65cbd8-5fed-412c-8ff8-ed43ef590ae7",
      requesterID: "0874daf0-5b0d-4c91-be85-1b88acd226d6",
      message: "ERROR"
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    });
})
