import Index from '../../pages/index';
import { render, screen } from '@testing-library/react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

const handlers = [
  graphql.query('GetPendingListings', async (req, res, ctx) => {
    ctx.data({
      GetPendingListings: [
        {
          "data": {
            "title": "A False Positive"
          },
          "listingid": "6c73eb69-f510-4661-a3d6-4a05b3f7a701",
        },
        {
          "data": {
            "title": "An Inappropriate Listing"
          },
          "listingid": "74d5c848-0baa-4ece-b91f-770781f89f23",
        },
        {
          "data": {
            "title": "Fuck Shit"
          },
          "listingid": "d338394e-db47-49f3-89a8-d14e2157d88b",
        },
      ]
    })
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('App Renders', async () => {
  render(<Index/>)
  await screen.findAllByText('Moderator Log In');
})
