import http from 'http'
import supertest from 'supertest';
import 'whatwg-fetch'
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';
import * as login from './login';
import requestHandler from './requestHandler'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const handlers = [
  rest.post('http://localhost:3010/api/v0/auth/login', async (req, res, ctx) => {
    const json = await req.json();
    return json.email==='molly@books.com' && json.password==='mollymember' ? 
      res(
        ctx.status(200),
        ctx.json(    
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "name": "Molly Member",
            "accessToken": "whatever",
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
  }),
  rest.post('http://localhost:3010/api/v0/auth/check', async (req, res, ctx) => {
    const token = await req.json();
    return token.encryptedToken === 'good' ? 
      res(
        ctx.status(200),
        ctx.json({
          "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
          "name": "Molly Member",
        })
      )
      :
      res(
        ctx.status(401),
      );
  }),
]

const mswServer = setupServer(...handlers);

beforeAll( async () => {
  server = http.createServer(requestHandler);
  server.listen();
  mswServer.listen();
  request = supertest(server);
  return;
});

afterEach(() => mswServer.restoreHandlers());

afterAll((done) => {
  server.close(done);
  mswServer.close();
}); 

const badPassword = {
  email: 'molly@books.com',
  password: 'foobarbaz'
};

test('Login 200 OK', async () => {
  const member = login.molly;
  await request.post('/api/graphql')
    .send({query: `{Login(email: "${member.email}" password: 
      "${member.password}") { userid, name, accessToken, roles }}`})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.Login).toBeDefined();
      expect(res.body.data.Login.name).toEqual('Molly Member');
      expect(res.body.data.Login.accessToken).toBeDefined();
      expect(res.body.data.Login.roles).toBeDefined();
      expect(res.body.data.Login.userid).toBeDefined();
    });
});

test('Bad Credentials: Password', async () => {
  const member = badPassword;
  await request.post('/api/graphql')
    .send({query: `{Login(email: "${member.email}" password: 
      "${member.password}") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('GOOD JWT', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer good')
    .send({query: `query Check { Check }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('BAD JWT', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer bad')
    .send({query: `query Check { Check }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('NOBEARER', async () => {
  await request.post('/api/graphql')
    .send({query: `query Check { Check }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});
