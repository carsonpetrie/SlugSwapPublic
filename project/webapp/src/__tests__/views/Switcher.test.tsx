
import { render, screen, fireEvent } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';

import 'whatwg-fetch'

import Switcher from '../../views/Switcher';

const handlers = [
  graphql.query('GetListing', async (req, res, ctx) => {
    const json = await req.json()
    if (json.query.indexOf('TESTING') >= 0) {
      return res(
        ctx.data({
          GetListing: {
            "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
            "categoryid": "Vehicles",
            "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "title": "2017 Honda Civic",
              "description": "Works on dowhills",
              "dateCreated": new Date().toISOString(),
              "price": 10000,
              "imgs": [
                "WHATEVER"
              ]
            }
          }
        }),
      )
    } else if (json.query.indexOf('NOIMG') >= 0) {
      return res(
        ctx.data({
          GetListing: {
            "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
            "categoryid": "Vehicles",
            "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "title": "2017 Honda Civic",
              "description": "Works on dowhills",
              "dateCreated": new Date().toISOString(),
              "price": 10000,
              "imgs": []
            }
          }
        }),
      )
    } else {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      )
    }
  })
]

jest.mock('next/router', () => require('next-router-mock'));
const server = setupServer(...handlers);

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = () => {
  render(<Switcher/>)
};

test('Listing Title Loads', async () => {
  renderView();
  fireEvent.click(screen.getByTestId('switch'));
});
