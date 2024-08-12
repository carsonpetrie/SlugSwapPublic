import http from 'http'
import supertest from 'supertest';
import 'whatwg-fetch'
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';
import requestHandler from './requestHandler'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let createSuccess = true;
let getSuccess = true;
let deleteSuccess = true; 

const handlers = [
  rest.post('http://localhost:3010/api/v0/auth/check', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
        "name": "Molly Member",
      })
    )
  }),
  rest.post('http://localhost:3012/api/v0/account/create', (req, res, ctx) => {
    return createSuccess ? 
      res(
        ctx.status(200),
        ctx.json(    
          {
            "userid": "5e1b7988-4869-44be-a25a-30f471dd5d7d",
            "email": "test@example.com",
            "data": {
              "name": "John Doe",
              "roles": [
                "member"
              ],
              "suspended": false,
              "timestamp": 1678257446126,
              "description": "User has not set a description."
            }
          }
        )
      ) 
      :
      res(
        ctx.status(409),
        ctx.json({
          errorMessage: `Error`,
        }),
      )
  }),
  rest.get('http://localhost:3012/api/v0/accounts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(    
        [
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "email": "Molly@books.com",
            "data": {
              "name": "Molly Member",
              "roles": [
                "member"
              ],
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "suspended": "false",
              "timestamp": "2021-05-12 20:00:05",
              "description": "Im Molly and I love buying 2017 Honda Civics!"
            }
          },
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "email": "Anna@books.com",
            "data": {
              "name": "Anna Admin",
              "roles": [
                "member",
                "admin"
              ],
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "suspended": "false",
              "timestamp": "2021-05-12 20:00:00",
              "description": "Im Anna and I love selling TVs!"
            }
          },
        ]
      )
    ) 
  }),
  rest.get('http://localhost:3012/api/v0/account', (req, res, ctx) => {
    return getSuccess ? 
      res(
        ctx.status(200),
        ctx.json(    
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "email": "Molly@books.com",
            "data": {
              "name": "Molly Member",
              "roles": [
                "member"
              ],
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "suspended": "false",
              "timestamp": "2021-05-12 20:00:05",
              "description": "Im Molly and I love buying 2017 Honda Civics!"
            }
          }
        )
      ) 
      :
      res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Error`,
        }),
      )
  }),
  rest.post('http://localhost:3012/api/v0/account/edit', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(    
        {
          "name": "Anna Admin",
          "roles": [
            "member",
            "admin"
          ],
          "avatar": "https://i.imgur.com/a5GQflf.png",
          "suspended": "false",
          "timestamp": "2021-05-12 20:00:00",
          "description": "Testing out changing descriptions!"
        }
      )
    ) 
  }),
  rest.post('http://localhost:3012/api/v0/account/delete', (req, res, ctx) => {
    return deleteSuccess ? 
      res(
        ctx.status(200),
        ctx.json(    
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "email": "Molly@books.com",
            "password": "$2a$06$GofkVUYcXOmDcNNSH8oRpezOpxxAihywagrEGOQhn/5feNkhV.0e2",
            "data": {
              "name": "Molly Member",
              "roles": [
                "member"
              ],
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "suspended": "false",
              "timestamp": "2021-05-12 20:00:05",
              "description": "Im Molly and I love buying 2017 Honda Civics!"
            }
          }
        )
      ) 
      :
      res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Error Acc Not Found`,
        }),
      )
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

test('CREATE NEW USER', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation { ` +
      `SignUp(input: { ` +
        `email: "test@example.com", ` +
        `password: "testpassword", ` +
        `name: "John Doe", ` +
      `}) ` +
      `{userid}}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.SignUp).toBeDefined();
      expect(res.body.data.SignUp.userid).toBeDefined();
    });
});

test('CREATE NEW USER WITH EXISTING EMAIL', async () => {
  createSuccess = false;
  await request.post('/api/graphql')
    .send({query: `mutation { ` +
      `SignUp(input: { ` +
        `email: "test@example.com", ` +
        `password: "testpassword", ` +
        `name: "John Doe", ` +
      `}) ` +
      `{userid}}`
    })
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('QUERY getUsers: OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' )
    .send({query: '{GetUsers {userid, data{avatar, name, roles}}}'})
    .expect(200) 
});

test('Get User', async () => {
  await request.post('/api/graphql')
    .send({query: `query { ` +
        `GetUser(userid: "0874daf0-5b0d-4c91-be85-1b88acd226d6") `+
        `{name, avatar, roles, timestamp, description}` +
      `}`
    })
    .expect(200)
});

test('Get Invalid User', async () => {
  getSuccess = false
  await request.post('/api/graphql')
    .send({query: `query { ` +
        `GetUser(userid: "32ddbf60-fa79-48a1-b749-77bac76f8ac5") `+
        `{name, avatar, roles, timestamp, description}` +
      `}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1);
    });
});

test('Edit User Data', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' )
    .send({query: `mutation { ` +
        `EditUserData(input:{
          userid: "aa327113-09b9-4e25-9c9e-93ad397eee9d"
          description: "Testing out changing descriptions!"
        }) `+
        `{name, avatar, roles, timestamp, description}` +
      `}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.EditUserData).toBeDefined();
      expect(res.body.data.EditUserData.name).toBeDefined();
      expect(res.body.data.EditUserData.description).toEqual("Testing out changing descriptions!");
    });
});

test('Edit Unauthorized User Data', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' )
    .send({query: `mutation { ` +
        `EditUserData(input:{
          userid: "0874daf0-5b0d-4c91-be85-1b88acd226d6"
          description: "Testing out changing descriptions!"
        }) `+
        `{name, avatar, roles, timestamp, description}` +
      `}`
    })
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Delete yourself', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' )
    .send({query: `mutation {
      deleteUser(input: {
        userid: "aa327113-09b9-4e25-9c9e-93ad397eee9d"
      }) 
      {userid}
    }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1);
    });
});

test('DELETE USER', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' )
    .send({query: `mutation {
        deleteUser(input: {
          userid: "0874daf0-5b0d-4c91-be85-1b88acd226d6"
        }){
          userid,
          data {
            avatar,
            name,
            roles
          }
        }
      }`})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.deleteUser).toBeDefined();
      expect(res.body.data.deleteUser.userid).toBeDefined();
    });
});

test('Delete user that does not exist', async () => {
  deleteSuccess = false; 
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation {
      deleteUser(input: {
        userid: "00000000-5b0d-4c91-be85-1b88acd226d6"
      }) 
      {userid}
    }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1);
    });
});
