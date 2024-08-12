/*
#######################################################################
#
# Copyright (C) 2022-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {graphql} from 'msw';
import {setupServer} from 'msw/node';
import 'whatwg-fetch';
import { UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';
import SignUp from '../../pages/SignUp';

import { getServerSideProps } from '../../pages/SignUp';

const handlers = [
  graphql.mutation('SignUp', async (req, res, ctx) => {
    const json = await req.json();
    if (json.query.indexOf('test@books.com') >= 0) {
      return res(
        ctx.data({
          createUser: {
            "userid": "SHOULDBEAUUID",
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

const server = setupServer(...handlers)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/router', ()=> ({push: jest.fn()}));

// Generated by Chat GPT to get rid of console warning for mocking
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

const renderView = () => {
  localStorage.clear();
  render(<SignUp />);
};


test('Success', async () => {
  renderView();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.alert = () => { };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'test@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'password');
  const username = screen.getByLabelText('Username');
  await userEvent.type(username, 'test');
  fireEvent.click(screen.getByRole('button', {
    name: 'signup',
  }));
});

test('Fail', async () => {
  renderView();
  let alerted = false;
  window.alert = () => {
    alerted = true
  };
  fireEvent.click(screen.getByRole('button', {
    name: 'signup',
  }));
  await waitFor(() => {
    expect(alerted).toBe(true)
  });
});

test('Cancel', async () => {
  renderView();
  fireEvent.click(screen.getByText('cancel'));
});

test('Sign Up Page', async () => {
  renderView();
  fireEvent.click(screen.getByText(`login`));
});

test('Already Signed in', async () => {
  await getServerSideProps({req: { headers: { host: 'localhost:3000/'}}})
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <SignUp/>
    </UserContext.Provider>
  );
});
