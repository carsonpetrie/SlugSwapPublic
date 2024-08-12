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

import Login from '../../pages/Login'

const handlers = [
  graphql.query('Login', async (req, res, ctx) => {
    const json = await req.json();
    if (json.query.indexOf('anna@books.com') >= 0) {
      return res(
        ctx.data({
          Login: {
            "name": "Anna Admin",
            "accessToken": "whatever",
            "roles": ["member", "admin"]
          }
        }),
      )
    } else if (json.query.indexOf('molly@books.com') >= 0) {
      return res(
        ctx.data({
          Login: {
            "name": "Molly Member",
            "accessToken": "whatever",
            "roles": ["member"]
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

const renderView = () => {
  localStorage.clear();
  render (
    <Login/>
  );
};

const renderViewAdmin = () => {
  localStorage.clear();
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <Login/>
    </UserContext.Provider>
  );
};

const renderViewMember = () => {
  localStorage.clear();
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Molly Member",accessToken:"whatever", userid:"ANNASUUID", roles:["member"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <Login/>
    </UserContext.Provider>
  );
};

test('Success', async () => {
  renderViewAdmin();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.alert = () => { };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'anna@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'annaadmin');
  fireEvent.click(screen.getByRole('button', {
    name: 'Log In',
  }));
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null)
  });
});

test('Fail - Member', async () => {
  renderViewMember();
  let alerted = false;
  window.alert = () => {
    alerted = true
  };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByRole('button', {
    name: 'Log In',
  }));
  await waitFor(() => {
    expect(alerted).toBe(true)
  });
  expect(localStorage.getItem('user')).toBe(null);
});

test('Fail - No Credentials', async () => {
  renderView();
  let alerted = false;
  window.alert = () => {
    alerted = true
  };
  fireEvent.click(screen.getByRole('button', {
    name: 'Log In',
  }));
  await waitFor(() => {
    expect(alerted).toBe(true)
  });
  expect(localStorage.getItem('user')).toBe(null);
});
