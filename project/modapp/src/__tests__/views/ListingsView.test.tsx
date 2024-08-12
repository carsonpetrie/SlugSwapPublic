
import Listings from '../../views/ListingsView';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import { UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';
import * as React from 'react';

import { 
  render, 
  screen, 
  fireEvent,
  waitFor 
} from '@testing-library/react';

const handlers = [
  graphql.query('GetPendingListings', async (req, res, ctx) => {
    console.log('1');
    if(req.headers.get('authorization') == 'Bearer expired') {
      return res(
        ctx.errors ([ {
          "message": "Bad Authorization"
        }]),
      );
    } 
    return res(
      ctx.data({
        GetPendingListings: [
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
      })
    )
  }),
  graphql.query('GetApprovedListings', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer expired') {
      return res(
        ctx.errors ([ {
          "message": "Bad Authorization"
        }]),
      );
    } 
    return res(
      ctx.data({
        GetApprovedListings: [
          {
            "listingid": "123450e4-adc3-46b8-bc62-43b373cf93f5",
            "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "categoryid": "Vehicles",
            "subcategoryid": "Cars & Trucks",
            "data": {
              "imgs": [
                "6b4b1c54-d787-4c61-b830-4ef5555a4610.webp"
              ],
              "price": 22000,
              "title": "2020 Nissan Ultima",
              "pending": "false",
              "dateCreated": "2023-02-20T19:42:00.207441+00:00",
              "description": "Worse for the wear"
            }
          }
        ]
      })
    )
  }),
  graphql.mutation('ApproveListing', async (req, res, ctx) => {
    return res(
      ctx.data({
        ApproveListing: {
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
        }
      }),
    )
  }),
  graphql.mutation('FlagListing', async (req, res, ctx) => {
    return res(
      ctx.data({
        FlagListing: {
          "listingid": "123450e4-adc3-46b8-bc62-43b373cf93f5",
          "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
          "categoryid": "Vehicles",
          "subcategoryid": "Cars & Trucks",
          "data": {
            "imgs": [
              "6b4b1c54-d787-4c61-b830-4ef5555a4610.webp"
            ],
            "price": 22000,
            "title": "2020 Nissan Ultima",
            "pending": "false",
            "dateCreated": "2023-02-20T19:42:00.207441+00:00",
            "description": "Worse for the wear"
          }
        }
      }),
    )
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen());
afterEach(() => {
  window.history.pushState(null, document.title, 'http:localhost:3002/');
  server.resetHandlers();
})
afterAll(() => server.close());

const renderListings = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Molly Member",accessToken:"whatever", userid:"MOLLYSUUID", roles:["member", "moderator"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <Listings/>
    </UserContext.Provider>
  );
};

const renderExpiredJWT = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Molly Member",accessToken:"expired", userid:"MOLLYSUUID", roles:["member", "moderator"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <Listings/>
    </UserContext.Provider>
  );
};

test('Render Listings Expired JWT', async () => {
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  renderExpiredJWT();
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('Renders Pending Listings Accordion', async () => {
  renderListings();
  const dropDown = await screen.findByText('Listings Pending Approval');
  fireEvent.click(dropDown);
  await screen.findByText('2019 Honda Accord')
});

test('Renders Approved Listings Accordion', async () => {
  renderListings();
  const dropDown = await screen.findByText('Approved Listings');
  fireEvent.click(dropDown);
  await screen.findByText('2020 Nissan Ultima')
});

test('Interact With Pending Listing', async () => {
  renderListings();
  const dropDown = await screen.findByText('Listings Pending Approval');
  fireEvent.click(dropDown);
  const link = await screen.findByText('2019 Honda Accord')
  fireEvent.click(link);
});

test('Interact With Approved Listing', async () => {
  renderListings();
  const dropDown = await screen.findByText('Approved Listings');
  fireEvent.click(dropDown);
  const link = await screen.findByText('2020 Nissan Ultima')
  fireEvent.click(link);
});

test('Approve Listing', async () => {
  renderListings();
  const dropDown = await screen.findByText('Listings Pending Approval')
  fireEvent.click(dropDown)
  const approve = await screen.findByLabelText('approve052880e4-adc3-46b8-bc62-43b373cf93f5')
  fireEvent.click(approve)
  const approved = await screen.findByText('Approved Listings')
  fireEvent.click(approved)
  await screen.findByText('2019 Honda Accord')
});

test('Flag Listing', async () => {
  renderListings();
  const dropDown = await screen.findByText('Approved Listings')
  fireEvent.click(dropDown)
  const approve = await screen.findByLabelText('flag123450e4-adc3-46b8-bc62-43b373cf93f5')
  fireEvent.click(approve)
  const approved = await screen.findByText('Listings Pending Approval')
  fireEvent.click(approved)
  await screen.findByText('2020 Nissan Ultima')
});

// test('Print Listings', async () => {
//   window.alert = jest.fn();
//   renderListings();
//   screen.debug(undefined, Infinity)
// });