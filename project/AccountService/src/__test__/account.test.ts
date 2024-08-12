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

const bad = {
  email: 'molly@books.com',
  password: 'notmollyspassword',
}

const molly = {
  "email": "molly@books.com",
  "password": "mollymember"
}

test('Good Credentials', async () => {
  await request.post('/api/v0/account/authenticate')
    .send(molly)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.userid).toBeDefined()
    });
});

test('Bad Credentials', async () => {
  await request.post('/api/v0/account/authenticate')
    .send(bad)
    .expect(401)
});

test('CREATE NEW USER', async () => {
  const req = {email: "test@example.com", password: "testpassword", name: "John Doe"};
  await request.post('/api/v0/account/create')
    .send(req)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.userid).toBeDefined()
      expect(res.body.email).toEqual('test@example.com')
      expect(res.body.data).toBeDefined()
    });
});

test('CREATE NEW USER WITH EXISTING EMAIL', async () => {
  const req = {email: "test@example.com", password: "testpassword", name: "John Doe"};
  await request.post('/api/v0/account/create')
    .send(req)
    .expect(409)
});

test('GET All', async () => {
  await request.get('/api/v0/accounts')
    .expect(200)
});

test('GET One', async () => {
  await request.get('/api/v0/account?id=0874daf0-5b0d-4c91-be85-1b88acd226d6')
    .expect(200)
});

test('GET One: DOES NOT EXIST', async () => {
  await request.get('/api/v0/account?id=00000000-09b9-4e25-9c9e-93ad397eee9d')
    .expect(404)
});

test('Edit User Data', async () => {
  const req = {id: '0874daf0-5b0d-4c91-be85-1b88acd226d6', description: 'This is a testing description'};
  await request.post('/api/v0/account/edit')
    .send(req)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.description).toBeDefined();
      expect(res.body.description).toEqual("This is a testing description");
    });
});

test('Edit User Data: ACCOUNT NOT FOUND', async () => {
  const req = {id: '00000000-0000-4c91-be85-1b88acd226d6', description: 'This is a testing description'};
  await request.post('/api/v0/account/edit')
    .send(req)
    .expect(404);
});

test('Enable Account OK', async () => {
  await request.post('/api/v0/enable')
    .send({"id": "bb123912-09b9-4e25-9c9e-93ad397eee9d"})
    .expect(200)
});

test('Enable Account 404', async () => {
  await request.post('/api/v0/enable')
    .send({"id": "11111111-1111-1111-1111-111111111111"})
    .expect(404)
});

test('Disable Account OK', async () => {
  await request.post('/api/v0/disable')
    .send({"id": "bb123912-09b9-4e25-9c9e-93ad397eee9d"})
    .expect(200)
});

test('Disable Account 404', async () => {
  await request.post('/api/v0/disable')
    .send({"id": "11111111-1111-1111-1111-111111111111"})
    .expect(404)
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});

test('DELETE USER', async () => {
  const req = {id: 'bb123912-09b9-4e25-9c9e-93ad397eee9d'}
  await request.post('/api/v0/account/delete')
    .send(req)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.userid).toEqual('bb123912-09b9-4e25-9c9e-93ad397eee9d');
    });
});

test('DELETE USER: USER DOES NOT EXIST', async () => {
  const req = {"id": 'bb123912-09b9-4e25-9c9e-93ad397eee9d'}
  await request.post('/api/v0/account/delete')
    .send(req)
    .expect(404);
});