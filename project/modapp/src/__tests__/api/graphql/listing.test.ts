import supertest from 'supertest';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';

import * as http from 'http';
import requestHandler from './requestHandler';
import 'whatwg-fetch'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const pendingListings = [
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
      "pending": "true",
      "dateCreated": "2023-02-20T19:42:00.207441+00:00",
      "description": "Rarely used. 10k mileage. OBO"
    }
  }
]

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
  rest.get('http://localhost:3014/api/v0/listing/pending', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(pendingListings)
    )
  }),
  rest.post('http://localhost:3014/api/v0/listing/get', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(pendingListings)
    )
  }),
  rest.put('http://localhost:3014/api/v0/listing/approve', async (req, res, ctx) => {
    const { id } = await req.json()
    if (id == '00000000-f510-4661-a3d6-4a05b3f7a701') {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Listing not found`
        })
      )
    } else {
      return res(
        ctx.status(200),
        ctx.json(pendingListings[0])
      )
    }
  }),
  rest.put('http://localhost:3014/api/v0/listing/flag', async (req, res, ctx) => {
    const { id } = await req.json()
    if (id == '00000000-f510-4661-a3d6-4a05b3f7a701') {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: `Listing not found`
        })
      )
    } else {
      return res(
        ctx.status(200),
        ctx.json(pendingListings[0])
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

afterEach(() => {
  window.history.pushState(null, document.title, 'http:localhost:3002/');
  mswServer.restoreHandlers()
})

afterAll((done) => {
  server.close(done);
  mswServer.close();
});

test('GET All Pending Listings', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: '{GetPendingListings {listingid, categoryid, posterid, data{description, imgs, price, title}}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      console.log(data.body);
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetPendingListings).toBeDefined();
    });
});

test('GET All Approved Listings', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: '{GetApprovedListings {listingid, categoryid, posterid, data{description, imgs, price, title}}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      console.log(data.body);
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.GetApprovedListings).toBeDefined();
    });
});

test('Approve Known Pending Listing', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 'mutation {ApproveListing (input: {listingid: "6c73eb69-f510-4661-a3d6-4a05b3f7a701"}) {listingid}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      console.log(data.body);
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.ApproveListing).toBeDefined();
    });
})

test('Approve Non-Existing Pending Listing', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 'mutation {ApproveListing (input: {listingid: "00000000-f510-4661-a3d6-4a05b3f7a701"}) {listingid}}'})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
})

test('Flag Known Approved listing', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 'mutation {FlagListing (input: {listingid: "6c73eb69-f510-4661-a3d6-4a05b3f7a701"}) {listingid}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      console.log(data.body);
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.FlagListing).toBeDefined();
    });
});

test('Flag Non-Existing Pending Listing', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ')
    .send({query: 'mutation {FlagListing (input: {listingid: "00000000-f510-4661-a3d6-4a05b3f7a701"}) {listingid}}'})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
})