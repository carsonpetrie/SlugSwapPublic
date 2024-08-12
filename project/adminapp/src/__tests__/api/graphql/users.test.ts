import http from 'http'
import supertest from 'supertest';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';

import requestHandler from './requestHandler'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

let succeed = true;

const handlers = [
  rest.post('http://localhost:3010/api/v0/auth/check', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
        "name": "Anna Admin",
        "roles": ["member", "admin"]
      })
    )
  }),
  rest.get('http://localhost:3012/api/v0/accounts', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(	
        [
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "name": "Molly Member",
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "roles": [
                "member"
              ],
              "suspended": "false"
            }
          },
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "data": {
              "name": "Anna Admin",
              "avatar": "https://i.imgur.com/sWFKQnd.jpeg",
              "roles": [
                "member",
                "admin"
              ],
              "suspended": "false"
            }
          },
        ]
      )
    )
  }),
  rest.post('http://localhost:3012/api/v0/enable', async (req, res, ctx) => {
    if(succeed) {
      return res(
        ctx.status(200),
        ctx.json(	
          {
            "userid": "bb123912-09b9-4e25-9c9e-93ad397eee9d"
          }
        )
      )
    } else {
      return res(
        ctx.status(404),
      )
    }
  }),
  rest.post('http://localhost:3012/api/v0/disable', async (req, res, ctx) => {
    if(succeed) {
      return res(
        ctx.status(200),
        ctx.json(	
          {
            "userid": "bb123912-09b9-4e25-9c9e-93ad397eee9d"
          }
        )
      )
    } else {
      return res(
        ctx.status(404),
      )
    }
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

test('GET All Users', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `query GetUsers {
      GetUsers {
        userid
        data {
          name
          avatar
          roles
          suspended
        }
      }
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetUsers).toBeDefined();
    });
});

test('Enable User', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation EnableUser {
      enableUser(input: {userid: "bb123912-09b9-4e25-9c9e-93ad397eee9d"}) {
        userid
      }
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.enableUser).toBeDefined();
    });
});

test('Enable User - Not Found', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation EnableUser {
      enableUser(input: {userid: "bb123912-09b9-4e25-9c9e-93ad397eee9d"}) {
        userid
      }
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.errors).toBeDefined();
    });
});

test('Disable User', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation DisableUser {
      disableUser(input: {userid: "bb123912-09b9-4e25-9c9e-93ad397eee9d"}) {
        userid
      }
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.disableUser).toBeDefined();
    });
});

test('Disable User - Not Found', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation DisableUser {
      disableUser(input: {userid: "bb123912-09b9-4e25-9c9e-93ad397eee9d"}) {
        userid
      }
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.errors).toBeDefined();
    });
});