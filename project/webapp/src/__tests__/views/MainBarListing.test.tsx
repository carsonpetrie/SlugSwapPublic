import {render, screen, fireEvent} from '@testing-library/react';
import MainBarListing from "../../views/Listings/MainBarListing";
import { UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';
import 'whatwg-fetch';

jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: ''}
  })
}))

function renderLoggedOut() {
  render(
    <UserContext.Provider value={{
      loginDetails: undefined, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <MainBarListing/>
    </UserContext.Provider>
  );
}

function renderLoggedIn() {
  render(
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <MainBarListing/>
    </UserContext.Provider>
  );
}

test('MainBarListing Logged Out', async () => {
  renderLoggedOut();
  // const login = await screen.findByText('Login');
  // fireEvent.click(login);
  // const signUp = await screen.findByText('Sign Up');
  // fireEvent.click(signUp);
  const icon = await screen.findByText('SlugSwap');
  fireEvent.click(icon);
})

test('MainBarListing Logged In', async () => {
  renderLoggedIn();
  // await screen.findByText('New Listing');
})