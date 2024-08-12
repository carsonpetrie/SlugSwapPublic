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
  rest.get('http://localhost:3013/api/v0/category', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(	
        [
          {
            "categoryid": "Vehicles",
            "data": {}
          },
          {
            "categoryid": "Computers",
            "data": {}
          }
        ]
      )
    )
  }),
  rest.post('http://localhost:3013/api/v0/category/create', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(201),
        ctx.json(	
          {
            "data": {
              "CreateCategory": {
                "categoryid": "Cars"
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(409),
      )
  }),
  rest.post('http://localhost:3013/api/v0/category/delete', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(200),
        ctx.json(	
          {
            "data": {
              "DeleteCategory": {
                "categoryid": "Vehicles"
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(404),
      )
  }),
  rest.post('http://localhost:3013/api/v0/category/edit', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(200),
        ctx.json(	
          {
            "data": {
              "EditCategory": {
                "categoryid": "foo",
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(400),
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
  rest.post('http://localhost:3013/api/v0/subcategory/create', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(201),
        ctx.json(	
          {
            "data": {
              "CreateSubCategory": {
                "categoryid": "Vehicles",
                "subcategoryid": "Lexus"
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(409),
      )
  }),
  rest.post('http://localhost:3013/api/v0/subcategory/create', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(201),
        ctx.json(	
          {
            "data": {
              "CreateSubCategory": {
                "categoryid": "Vehicles",
                "subcategoryid": "Vans & Buses"
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(409),
      )
  }),
  rest.post('http://localhost:3013/api/v0/subcategory/delete', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(200),
        ctx.json(	
          {
            "data": {
              "DeleteSubCategory": {
                "subcategoryid": "Boats & Marine"
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(404),
      )
  }),
  rest.post('http://localhost:3013/api/v0/subcategory/edit', async (req, res, ctx) => {
    return succeed ?
      res(
        ctx.status(200),
        ctx.json(	
          {
            "data": {
              "EditSubCategory": {
                "categoryid": "Vehicles",
                "subcategoryid": "Motorbikes",
              }
            }
          }
        )
      ) 
      :
      res(
        ctx.status(400),
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

test('GET All Categories', async () => {
  await request.post('/api/graphql')
    .send({query: 'query GetCategories {GetCategories {categoryid}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetCategories).toBeDefined();
    });
});

test('CREATE Category', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation CreateCategory {
      CreateCategory(input: {categoryid: "Cars"}) {categoryid}}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('CREATE Category Duplicate', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation CreateCategory {
      CreateCategory(input: {categoryid: "Cars"}) {categoryid}}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('DELETE Category', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation DeleteCategory {
      DeleteCategory(input: {
        categoryid: "Vehicles"
      }) {
        categoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('DELETE Category: Non Exist', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation DeleteCategory {
      DeleteCategory(input: {
        categoryid: "qwe"
      }) {
        categoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});


test('EDIT Category', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation EditCategory {
      EditCategory(input: {
        categoryid: "Vehicles",
        newid: "foo",
      }) {
        categoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('EDIT Category: Non Exist', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation EditCategory {
      EditCategory(input: {
        categoryid: "Vehicles",
        newid: "foo",
      }) {
        categoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('GET All Vehicles SubCategories', async () => {
  succeed = true;
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

test('CREATE SubCategory', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation CreateSubCategory {
      CreateSubCategory(input: {
        categoryid: "Vehicles", 
        subcategoryid: "Vans & Buses"
      }) {categoryid, subcategoryid}}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('CREATE SubCategory - Dupe', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation CreateSubCategory {
      CreateSubCategory(input: {
        categoryid: "Vehicles", 
        subcategoryid: "Cars & Trucks"
      }) {categoryid, subcategoryid}}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('DELETE SubCategory', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation DeleteSubCategory {
      DeleteSubCategory(input: {
        subcategoryid: "Boats & Marine"
      }) {
        categoryid,
        subcategoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('DELETE SubCategory', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation DeleteSubCategory {
      DeleteSubCategory(input: {
        subcategoryid: "Boats & Marineford"
      }) {
        categoryid,
        subcategoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('EDIT SubCategory', async () => {
  succeed = true;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation EditSubCategory {
      EditSubCategory(input: {
        subcategoryid: "Motorcycles",
        newid: "Motorbikes",
      }) {
        categoryid,
        subcategoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});

test('EDIT SubCategory', async () => {
  succeed = false;
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: `mutation EditSubCategory {
      EditSubCategory(input: {
        subcategoryid: "Motorcycles",
        newid: "Cameprs & RV",
      }) {
        categoryid,
        subcategoryid
      }
    }`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
    });
});