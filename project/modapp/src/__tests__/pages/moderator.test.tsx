import { render, screen } from '@testing-library/react';
import Moderator from '../../pages/moderator';
import { UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';

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

beforeAll(() => server.listen());
afterEach(() => {
  window.history.pushState(null, document.title, 'http:localhost:3002/moderator');
  server.resetHandlers();
})
afterAll(() => server.close());
const renderModerator = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Max Moderator",accessToken:"whatever", userid:"MAXUUID", roles:["member", "moderator"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <Moderator/>
    </UserContext.Provider>
  );
};

test('App Renders Authorized', async () => {
  renderModerator();
  await screen.findByText('SlugSwap - Moderation');
})

test('App Renders Unathorized', async () => {
  render(<Moderator/>);
  await screen.findByText('Unauthorized! Click Here To Login');
})
