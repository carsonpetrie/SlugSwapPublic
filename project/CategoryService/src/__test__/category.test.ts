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

// const bad = {
//   email: 'molly@books.com',
//   password: 'notmollyspassword',
// }

// const molly = {
//   "email": "molly@books.com",
//   "password": "mollymember"
// }

test('GET All', async () => {
  await request.get('/api/v0/category/')
    .expect(200)
});

test('CREATE', async () => {
  await request.post('/api/v0/category/create')
    .send({"categoryid": "Chouse"})
    .expect(201)
});

test('CREATE Dupe', async () => {
  await request.post('/api/v0/category/create')
    .send({"categoryid": "Vehicles"})
    .expect(409)
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});

test('DELETE Category', async () => {
  const req = {"categoryid": "Vehicles"}
  await request.post('/api/v0/category/delete')
    .send(req)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.categoryid).toEqual('Vehicles');
    });
});

test('DELETE Category: Category does not exist', async () => {
  const req = {"categoryid": "random"}
  await request.post('/api/v0/category/delete')
    .send(req)
    .expect(404);
});

test('UPDATE Category', async () => {
  const req = {
    "categoryid": 'Computers',
    "newid": 'Beep Boop',
  };
  await request.post('/api/v0/category/edit')
    .send(req)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.categoryid).toBeDefined();
    });
});

test('UPDATE Category: Does not exist', async () => {
  const req = {
    "categoryid": 'Random',
    "newid": 'asd',
  };
  await request.post('/api/v0/category/edit')
    .send(req)
    .expect(404);
});