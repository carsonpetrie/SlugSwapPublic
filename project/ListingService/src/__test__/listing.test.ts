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

test('Get All Listings NO QUERY PARAMS', async () => {
  await request.post('/api/v0/listing/get')
    .expect(200)
});

test('Get All Listings: Title', async () => {
  await request.post('/api/v0/listing/get')
    .send({searchValue: "Honda"})
    .expect(200)
});

test('Get All Listings: Category', async () => {
  await request.post('/api/v0/listing/get')
    .send({category: "Computers"})
    .expect(200)
});

test('Get All Listings: Category + Subcategory', async () => {
  await request.post('/api/v0/listing/get')
    .send({category: "Computers", subcategory: "Computer Monitors"})
    .expect(200)
});

test('Get All Listings: Category + Subcategory + Attributes', async () => {
  await request.post('/api/v0/listing/get')
    .send({category: "Vehicles", subcategory: "Cars & Trucks", attributes: "[{\"Name\":\"Make\",\"Contents\":[\"Honda\", \"Jeep\"]}, {\"Name\":\"Transmission\",\"Contents\":[\"Automatic\"]}]"})
    .expect(200)
});

test('Get All Listings: Category + Title', async () => {
  await request.post('/api/v0/listing/get')
    .send({category: "Vehicles", searchValue: "Honda"})
    .expect(200)
});

test('Get All Listings: Category + Title + Subcategory', async () => {
  await request.post('/api/v0/listing/get')
    .send({category: "Computers", searchValue: "RTX", subcategory: "Computer Monitors"})
    .expect(200)
});

test('Get All Listings: Category + Title + Subcategory + Attributes', async () => {
  await request.post('/api/v0/listing/get')
    .send({category: "Vehicles", searchValue: "Honda", subcategory: "Cars & Trucks", attributes: "[{\"Name\":\"Make\",\"Contents\":[\"Honda\", \"Jeep\"]}, {\"Name\":\"Transmission\",\"Contents\":[\"Automatic\"]}]"})
    .expect(200)
});

test('Get Posters Listings', async () => {
  await request.get('/api/v0/listing/poster')
    .query({posterid: "052880e4-adc3-46b8-bc62-43b373cf93f4"})
    .expect(200)  
})

const newListing = {
  "id": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
  "categoryid": "Vehicles",
  "subcategoryid": "Cars & Trucks",
  "title": "Test Truck",
  "description": "Testing",
  "price": 12.99,
  "imgs": []
}

test('Create Listing', async () => {
  await request.post('/api/v0/listing')
    .send(newListing)
    .expect(200);
})

const profaneListing = {
  "id": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
  "categoryid": "Vehicles",
  "subcategoryid": "Cars & Trucks",
  "title": "knob",
  "description": "Testing",
  "price": 12.99,
  "imgs": []
}

test('Create Listing: Profane', async () => {
  await request.post('/api/v0/listing')
    .send(profaneListing)
    .expect(200);
})

test('Get Listing', async () => {
  await request.get('/api/v0/listing/get/052880e4-adc3-46b8-bc62-43b373cf93f4')
    .expect(200);
})

test('Get Listing: Listing Does Not Exist', async () => {
  await request.get('/api/v0/listing/get/00000000-adc3-46b8-bc62-43b373cf93f4')
    .expect(404);
})

test('Delete Listing: Unowned Member', async () => {
  const req = {listingID: '052880e4-adc3-46b8-bc62-43b373cf93f4', userID: "00000000-5b0d-4c91-be85-1b88acd226d6", roles: ["member"]}
  await request.delete('/api/v0/listing')
    .send(req)
    .expect(401)
});

test('Delete Listing: Owned Member', async () => {
  const req = {listingID: '052880e4-adc3-46b8-bc62-43b373cf93f4', userID: "0874daf0-5b0d-4c91-be85-1b88acd226d6", roles: ["member"]}
  await request.delete('/api/v0/listing')
    .send(req)
    .expect(200)
});

test('Delete Listing: Listing Not Found', async () => {
  const req = {listingID: '052880e4-adc3-46b8-bc62-43b373cf93f4', userID: "0874daf0-5b0d-4c91-be85-1b88acd226d6", roles: ["member"]}
  await request.delete('/api/v0/listing')
    .send(req)
    .expect(401)
});

test('Get Pending Listings', async () => {
  await request.get('/api/v0/listing/pending')
    .expect(200);
})

test('Approve Pending Listing', async () => {
  const req = {id: '74d5c848-0baa-4ece-b91f-770781f89f23'}
  await request.put('/api/v0/listing/approve')
    .send(req)
    .expect(200);
})

test('Approve Pending Listing: Not Found', async () => {
  const req = {id: '052880e4-adc3-46b8-bc62-43b373cf93f4'}
  await request.put('/api/v0/listing/approve')
    .send(req)
    .expect(404);
});

test('Flag Approved Listing', async () => {
  const req = {id: "2da03677-efd1-453b-a0e0-ca6d7ef22ef0"}
  await request.put('/api/v0/listing/flag')
    .send(req)
    .expect(200);
})

test('Approve Pending Listing: Not Found', async () => {
  const req = {id: '052880e4-adc3-46b8-bc62-43b373cf93f4'}
  await request.put('/api/v0/listing/flag')
    .send(req)
    .expect(404);
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});