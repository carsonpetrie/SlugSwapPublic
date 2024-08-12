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

test('GET All', async () => {
  await request.get('/api/v0/subcategory/Vehicles')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body[1].subcategoryid).toBeDefined();
    });
});

test('CREATE', async () => {
  await request.post('/api/v0/subcategory/create')
    .send({
      "subcategoryid": "Lexus",
      "categoryid": "Vehicles"
    })
    .expect(201)
});

test('CREATE Dupe', async () => {
  await request.post('/api/v0/subcategory/create')
    .send({
      "subcategoryid": "Cars & Trucks",
      "categoryid": "Vehicles"
    })
    .expect(409)
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});

test('DELETE SubCategory', async () => {
  const req = {"subcategoryid": "Motorcycles"}
  await request.post('/api/v0/subcategory/delete')
    .send(req)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.subcategoryid).toEqual('Motorcycles');
    });
});

test('DELETE SubCategory: SubCategory does not exist', async () => {
  const req = {"subcategoryid": "random"}
  await request.post('/api/v0/subcategory/delete')
    .send(req)
    .expect(404);
});

test('UPDATE SubCategory', async () => {
  const req = {
    "subcategoryid": "Campers & RVs",
    "newid": "Trailers"
  };
  await request.post('/api/v0/subcategory/edit')
    .send(req)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.subcategoryid).toBeDefined();
    });
});

test('UPDATE SubCategory: Does not exist', async () => {
  const req = {
    "subcategoryid": 'Random',
    "newid": 'asd',
  };
  await request.post('/api/v0/subcategory/edit')
    .send(req)
    .expect(404);
});