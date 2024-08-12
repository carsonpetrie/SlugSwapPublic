import http from 'http'
import supertest from 'supertest';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';
import requestHandler from './requestHandler'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const handlers = [
  rest.get('http://localhost:3013/api/v0/category', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(	
        [
          {
            "categoryid": "Vehicles",
            "data": null
          },
          {
            "categoryid": "Computers",
            "data": null
          }
        ]
      )
    ) 
  }),
  rest.get('http://localhost:3013/api/v0/subcategory/Vehicles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(	
        [
          {
            "subcategoryid": "Cars",
            "categoryid": "Vehicles",
            "data": null
          },
          {
            "subcategoryid": "Trucks",
            "categoryid": "Vehicles",
            "data": null
          }
        ]
      )
    ) 
  }),
  rest.get('http://localhost:3013/api/v0/attribute/Cars%20&%20Trucks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(	
        {
          'attributes':  `{"ATTRIBUTES": [{"name": "Make", "type": "ENUM", "contents": ["Audi", "Tesla"]}, {"name": "Transmission", "type": "ENUM", "contents": ["Automatic", "Manual"]}]}`
        }
      )
    ) 
  }),
  rest.post('http://localhost:3010/api/v0/auth/check', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
        "name": "Molly Member",
      })
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

test('GET All Categories', async () => {
  await request.post('/api/graphql')
    .send({query: 'query GetCategories {GetCategories {categoryid}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
    });
});

test('GET All Vehicles SubCategories', async () => {
  await request.post('/api/graphql')
    .send({query: `query GetSubCategories {
      GetSubCategories (categoryid: {
        categoryid: "Vehicles"}) 
        {
        subcategoryid
        } 
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
    });
});

test('GET Attributes', async () => {
  await request.post('/api/graphql')
    .send({query: `query GetAttributes {
      GetAttributes (subcategoryid: {
        subcategoryid: "Cars & Trucks"}) 
        {
        attributes
        } 
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
    });
});