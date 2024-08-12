import { UserContext } from '../../views/context';
import { fireEvent, render, screen } from '@testing-library/react'

import 'whatwg-fetch'

import PreviewListing from '../../views/Listings/ListingContent';
import { UserSession } from '../../graphql/auth/schema';

const listing = {
  "listingid": "052880e4-adc3-46b8-bc62-43b373cf93f4",
  "categoryid": "Vehicles",
  "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
  "data": {
    "title": "2017 Honda Civic",
    "description": "Works on dowhills",
    "price": 10000,
    "imgs": [
      "1",
      "2",
    ]
  }
}

jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: ''}
  })
}))

const renderView = () => {
  render(<PreviewListing listing={listing}/>)
};

const renderSignedIn = () => {
  render(
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <PreviewListing listing={listing}/>
    </UserContext.Provider>
  )
};

test('Listing Title Loads', async () => {
  renderView();
  await screen.findByText('2017 Honda Civic')
});

test('Listing Signed In', async () => {
  renderSignedIn();
  await screen.findByText('listing.purchase-now');
  await screen.findByText('listing.contact-seller');
});

test('Next Button', async () => {
  renderView();
  const next = await screen.findByText('listing.next');
  fireEvent.click(next);
});

test('Back Button', async () => {
  renderView();
  const next = await screen.findByText('listing.next');
  fireEvent.click(next);
  const back = await screen.findByText('listing.back');
  fireEvent.click(back);
});

test('Back Button', async () => {
  renderView();
  const signUp = await screen.findByText('listing.purchase-now-guest');
  fireEvent.click(signUp);
  const signIn = await screen.findByText('listing.contact-seller-guest');
  fireEvent.click(signIn);
});
