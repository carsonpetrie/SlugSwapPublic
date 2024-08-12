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

test('GET Attributes', async () => {
  await request.get('/api/v0/attribute/Cars & Trucks')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.attributes).toBeDefined();
    });
});