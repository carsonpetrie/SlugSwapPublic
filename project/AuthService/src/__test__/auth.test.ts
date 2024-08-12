import supertest from 'supertest';
import * as http from 'http';
import * as jwt from "jsonwebtoken";
import app from '../app';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { env } from '../env';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const handlers = [
  rest.post('http://localhost:3012/api/v0/account/authenticate', async (req, res, ctx) => {
    const deets = await req.json();
    return deets.email==='anna@books.com' && deets.password==='goodpass' ? 
      res(
        ctx.status(200),
        ctx.json(	
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "name": "Anna Admin",
            "roles": [
              "member",
              "admin"
            ],
          }
        )
      ) 
      :
      res(
        ctx.status(401)
      )
  })
]

const mswServer = setupServer(...handlers);

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  mswServer.listen({ onUnhandledRequest: "bypass" });
  request = supertest(server);
});

afterEach(() => mswServer.restoreHandlers());

afterAll(async () => {
  server.close();
  mswServer.close();
});

const bad = {
  email: 'molly@books.com',
  password: 'notmollyspassword',
}

const molly = {
  "email": "anna@books.com",
  "password": "goodpass"
}

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});

let accessToken = '';

test('Good Credentials', async () => {
  await request.post('/api/v0/auth/login')
    .send(molly)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.userid).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      accessToken = res.body.accessToken;
      expect(res.body.userid).toBeDefined();
      expect(res.body.roles).toBeDefined();
    });
});

test('Bad Credentials', async () => {
  await request.post('/api/v0/auth/login')
    .send(bad)
    .expect(401)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    });
});

test('Check Authorized Creds', async () => {
  await request.post('/api/v0/auth/check')
    .send({
      encryptedToken: accessToken,
      roles: ['member'],
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.name).toBeDefined();
      expect(res.body.userid).toBeDefined();
    });
});

test('Check Authorized Creds For NonRole', async () => {
  await request.post('/api/v0/auth/check')
    .send({
      encryptedToken: accessToken,
      roles: ['superadmin'],
    })
    .expect(401)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    });
});

test('Check Authorized Creds For NonRole', async () => {
  await request.post('/api/v0/auth/check')
    .send({
      encryptedToken: 'THIS IS NOT A VALID JWT',
      roles: [],
    })
    .expect(401)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    });
});

test('Check Authorized Creds For NonRole', async () => {
  await request.post('/api/v0/auth/check')
    .send({
      encryptedToken: jwt.sign('EVIL SHOULD NOT BE STRING', env.JWT_SECRET_KEY),
      roles: [],
    })
    .expect(401)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.reason).toBeDefined();
    });
});
