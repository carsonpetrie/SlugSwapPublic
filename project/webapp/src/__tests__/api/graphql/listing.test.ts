import supertest from 'supertest';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';

import * as http from 'http';
import requestHandler from './requestHandler';
import 'whatwg-fetch';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let succeed = true;

const listings = [
  {
    "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f5",
    "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
    "categoryid": "Vehicles",
    "subcategoryid": "Cars & Trucks",
    "data": {
      "imgs": [
        "6b4b1c54-d787-4c61-b830-4ef5555a4610.webp"
      ],
      "price": 22000,
      "title": "2019 Honda Accord",
      "pending": "false",
      "dateCreated": "2023-02-20T19:42:00.207441+00:00",
      "description": "Rarely used. 10k mileage. OBO"
    }
  },
  {
    "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
    "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
    "categoryid": "Vehicles",
    "subcategoryid": "Cars & Trucks",
    "data": {
      "imgs": [
        "76df60a9-a1ea-41c7-9de0-ca6d7e2639b4.webp"
      ],
      "price": 25000,
      "title": "2017 Honda Civic",
      "pending": "false",
      "dateCreated": "2023-02-10T19:42:00.207441+00:00",
      "description": "Original owner selling car. Has been well cared for and is only at 60,000 miles. No accidents, and has been dealer serviced at 50,000 miles. Looking to sell locally. Please only contact me with serious offers, lowballs will not be considered."
    }
  }
]

const handlers = [
  rest.post('http://localhost:3010/api/v0/auth/check', async (req, res, ctx) => {
    const token = await req.json();  
    if (token.encryptedToken === 'MEMBER') {
      return res(
        ctx.status(200),
        ctx.json({
          "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
          "name": "Molly Member",
          "roles": ["member"]
        })
      )
    } else {
      ctx.status(200),
      ctx.json({
        "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
        "name": "Anna Admin",
        "roles": ["admin"]
      })
    }
  }),
  rest.post('http://localhost:3011/api/v0/image/listing', (req, res, ctx) => {
    return succeed ? 
      res(
        ctx.status(200),
        ctx.json({
          fileName: 'whatever.webp',
        })
      ) 
      :
      res(
        ctx.status(400),
      )
  }),
  rest.post('http://localhost:3014/api/v0/listing/get', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(listings)
    )
  }),
  rest.get('http://localhost:3014/api/v0/listing/poster', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(listings)
    )
  }),
  rest.post('http://localhost:3014/api/v0/listing', async (req, res, ctx) => {
    const { categoryid } = await req.json()
    if (categoryid != "NOTEXIST") {
      return res(
        ctx.status(200),
        ctx.json({
          "listingid": "00000000-adc3-46b8-bc62-43b373cf93f5",
          "posterid": "00000000-5b0d-4c91-be85-1b88acd226d6",
          "categoryid": "Whatever",
          "subcategoryid": "Whatever",
          "data": {
            "imgs": [
              "00000000-d787-4c61-b830-4ef5555a4610.webp"
            ],
            "price": 1,
            "title": "Whatever",
            "pending": "false",
            "dateCreated": "2023-02-20T19:42:00.207441+00:00",
            "description": "Whatever"
          }
        })
      )
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Category not found`
        })
      )
    }
  }),
  rest.get('http://localhost:3014/api/v0/listing/get/*', async (req, res, ctx) => {
    if (req.url.pathname.includes("052880e4-adc3-46b8-bc62-43b373cf93f4")) {
      return res(
        ctx.status(200),
        ctx.json({
          "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
          "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
          "categoryid": "Vehicles",
          "subcategoryid": "Cars & Trucks",
          "data": {
            "imgs": [
              "76df60a9-a1ea-41c7-9de0-ca6d7e2639b4.webp"
            ],
            "price": 25000,
            "title": "2017 Honda Civic",
            "pending": "false",
            "dateCreated": "2023-02-10T19:42:00.207441+00:00",
            "description": "Original owner selling car. Has been well cared for and is only at 60,000 miles. No accidents, and has been dealer serviced at 50,000 miles. Looking to sell locally. Please only contact me with serious offers, lowballs will not be considered."
          }
        })
      )
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Listing Not Found`
        })
      )
    }
  }),
  rest.delete('http://localhost:3014/api/v0/listing', async (req, res, ctx) => {
    const { listingID, roles } = await req.json()
    console.log('-> ', listingID, roles, ' <-');
    // if listingID is a known valid and owned by a member 
    if ((listingID == "052880e4-adc3-46b8-bc62-43b373cf93f4") && (!roles.includes("admin"))){
      return res(
        ctx.status(200),
        ctx.json({
          "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
          "posterid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
          "categoryid": "Vehicles",
          "subcategoryid": "Cars & Trucks",
          "data": {
            "imgs": [
              "76df60a9-a1ea-41c7-9de0-ca6d7e2639b4.webp"
            ],
            "price": 25000,
            "title": "2017 Honda Civic",
            "pending": "false",
            "dateCreated": "2023-02-10T19:42:00.207441+00:00",
            "description": "Original owner selling car. Has been well cared for and is only at 60,000 miles. No accidents, and has been dealer serviced at 50,000 miles. Looking to sell locally. Please only contact me with serious offers, lowballs will not be considered."
          }
        })
      )
    // else if listingID is a known valid but onwned by member
    } else if ((listingID == '2c8a5658-0b86-4055-9ef1-dbc5dc2ca5f3') && (!roles.includes("admin"))) {
      return res(
        ctx.status(401),
        ctx.json({
          errorMessage: `Unauthorized`
        })
      )
    // else if listingID is known valid and being deleted by admin
    } else if ((listingID == "052880e4-adc3-46b8-bc62-43b373cf93f4") && (roles.includes("admin"))){
      return res(
        ctx.status(200),
        ctx.json({
          "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
          "posterid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
          "categoryid": "Vehicles",
          "subcategoryid": "Cars & Trucks",
          "data": {
            "imgs": [
              "76df60a9-a1ea-41c7-9de0-ca6d7e2639b4.webp"
            ],
            "price": 25000,
            "title": "2017 Honda Civic",
            "pending": "false",
            "dateCreated": "2023-02-10T19:42:00.207441+00:00",
            "description": "Original owner selling car. Has been well cared for and is only at 60,000 miles. No accidents, and has been dealer serviced at 50,000 miles. Looking to sell locally. Please only contact me with serious offers, lowballs will not be considered."
          }
        })
      )
    // else listingID does not exist
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Listing Not Found`
        })
      )
    }
  }),
]

const mswServer = setupServer(...handlers);

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  mswServer.listen();
  request = supertest(server);
  mswServer.listen({ onUnhandledRequest: "bypass" });
  await new Promise(resolve => setTimeout(resolve, 500));
  return;
});

afterEach(() => mswServer.restoreHandlers());

afterAll((done) => {
  server.close(done);
  mswServer.close();
  mswServer.close();
});

test('GET All', async () => {
  await request.post('/api/graphql')
    .send({query: '{GetListings {listingid, categoryid, posterid, data{description, imgs, price, title}}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

test('GET Listings by Title', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListings (listingTitle: {title: "Honda"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

test('GET Listings by Poster', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListingsByPoster (listingPoster: {posterid: "0874daf0-5b0d-4c91-be85-1b88acd226d6"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListingsByPoster).toBeDefined();
    });
});

test('GET Listings by Title And Category', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListings (listingCategory: {category: "Vehicles"} listingTitle: {title: "Honda"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

test('GET Listings by Title, Category, and SubCategory', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListings (listingCategory: {category: "Vehicles"} listingSubCategory: {subcategory: "Cars & Trucks"} listingTitle: {title: "Honda"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

// test('GET Listings by Title, Category, SubCategory, and Attributes', async () => {
//   await request.post('/api/graphql')
//     .send({query: `{GetListings (listingCategory: {category: "Vehicles"} listingSubCategory: {subcategory: "Cars & Trucks"} listingAttributes: {attributes: "[{\"Name\":\"Make\",\"Contents\":[\"Nissan\"]}]"} listingTitle: {title: "Nissan"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then((data) => {
//       expect(data).toBeDefined();
//       expect(data.body).toBeDefined();
//       expect(data.body.data).toBeDefined();
//       expect(data.body.data.GetListings).toBeDefined();
//     });
// });

test('GET Listings by Category and SubCategory', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListings (listingCategory: {category: "Vehicles"} listingSubCategory: {subcategory: "Cars & Trucks"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

test('GET Listings by Title And All', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListings (listingCategory: {category: "All"} listingTitle: {title: "Honda"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

test('GET Listings by Category', async () => {
  await request.post('/api/graphql')
    .send({query: `{GetListings (listingCategory: {category: "Vehicles"}) {listingid, categoryid, posterid, data{description, imgs, price, title}}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListings).toBeDefined();
    });
});

test('QUERY getListing: OK', async() => {
  const listingID = '052880e4-adc3-46b8-bc62-43b373cf93f4';
  await request.post('/api/graphql')
    .send({query: `{GetListing (listingID: {listingid: "${listingID}"}) {listingid, categoryid, posterid, data {title, description, price, imgs}}}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetListing).toBeDefined();
      expect(data.body.data.GetListing.data.title).toBe('2017 Honda Civic');
    });
});

test('QUERY getListing: ERROR -> Listing Does Not Exist', async() => {
  const listingID = '00000000-0000-46b8-bc62-43b373cf93f4';
  await request.post('/api/graphql')
    .send({query: `{GetListing (listingID: {listingid: "${listingID}"}) {listingid, categoryid, posterid, data {title, description, price, imgs}}}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('Create New Listing NO images', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .send({query: `mutation { ` +
      `CreateListing( ` +
        `input: {categoryid: "Vehicles", subcategoryid: "Cars & Trucks", title: "Car fer sale", description: "Its a junker", price: 1.50, images:[]} ` +
      `) { ` +
        `listingid ` +
      `} ` +
    `}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.CreateListing).toBeDefined();
      expect(res.body.data.CreateListing.listingid).toBeDefined();
    });
});

test('Create New Listing NO images + PROFANITY PENDING REVIEW', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .send({query: `mutation { ` +
      `CreateListing( ` +
        `input: {categoryid: "Vehicles", subcategoryid: "Cars & Trucks", title: "Door Knob", description: "Opens Doors", price: 1.50, images:[]} ` +
      `) { ` +
        `listingid ` +
      `} ` +
    `}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.CreateListing).toBeDefined();
      expect(res.body.data.CreateListing.listingid).toBeDefined();
    });
});

test('Create New Listing WITH IMAGE', async () => {
  const query = "mutation CreateListing($images: [File!]!){CreateListing(input: {categoryid: \"Vehicles\", subcategoryid: \"Cars & Trucks\", title: \"CAR\", description: \"CAR\", price: 1.5, images: $images}) {posterid, listingid}}";
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .field('operations', JSON.stringify({query, "variables": { "images": []} }))
    .field('map', JSON.stringify({"0":["variables.images.0"]}))
    .field('0', 'a')
    //.attach('0', './src/__tests__/api/graphql/succeed.txt')
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.CreateListing).toBeDefined();
      expect(res.body.data.CreateListing.listingid).toBeDefined();
    });
});

test('FAIL: Create New Listing WITH IMAGE', async () => {
  succeed = false;
  const query = "mutation CreateListing($images: [File!]!){CreateListing(input: {categoryid: \"Vehicles\", subcategoryid: \"Cars & Trucks\", title: \"CAR\", description: \"CAR\", price: 1.5, images: $images}) {posterid, listingid}}";
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .field('operations', JSON.stringify({query, "variables": { "images": []} }))
    .field('map', JSON.stringify({"0":["variables.images.0"]}))
    .field('0', 'a')
    //.attach('0', './src/__tests__/api/graphql/fail.txt')
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.CreateListing).toBeDefined();
      expect(res.body.data.CreateListing.listingid).toBeDefined();
    });
});

test('Create New Listing FAIL', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .send({query: `mutation { ` +
      `CreateListing( ` +
        `input: {categoryid: "NOTEXIST", subcategoryid: "Cars & Trucks", title: "Car fer sale", description: "Its a junker", price: 1.50, images:[]} ` +
      `) { ` +
        `listingid ` +
      `} ` +
    `}`
    })
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('DELETE OWNED Listing AS MEMBER', async() => {
  const listingID = '052880e4-adc3-46b8-bc62-43b373cf93f4';
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .send({query: `mutation DeleteListing {
      DeleteListing (input: {
        listingid: "${listingID}"}) {
        listingid} 
    }`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
});

test('DELETE UNOWNED LISTING AS MEMBER', async() => {
  const listingID = '00000000-0b86-4055-9ef1-dbc5dc2ca5f3';
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .send({query: `mutation DeleteListing {
      DeleteListing (input: {
        listingid: "${listingID}"}) {
        listingid} 
    }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('DELETE UNOWNED LISTING AS ADMIN', async() => {
  const listingID = '052880e4-adc3-46b8-bc62-43b373cf93f4';
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ADMIN')
    .send({query: `mutation DeleteListing {
      DeleteListing (input: {
        listingid: "${listingID}"}) {
        listingid} 
    }`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
});

test('DELETE NONEXISTING LISTING', async() => {
  const listingID = '00000000-0b86-4055-9ef1-dbc5dc2ca5f3';
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer MEMBER')
    .send({query: `mutation DeleteListing {
      DeleteListing (input: {
        listingid: "${listingID}"}) {
        listingid} 
    }`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});
