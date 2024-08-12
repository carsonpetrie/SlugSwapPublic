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


import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import { UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';
import AdminMenu from '../../views/AdminMenu';

const handlers = [
  graphql.query('GetCategories', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetCategories: [
          {
            "categoryid": "Vehicles"
          },
          {
            "categoryid": "Furniture"
          },
          {
            "categoryid": "Clothes"
          }
        ]
      }),
    )
  }),
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
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen());
afterEach(() => {
  window.history.pushState(null, document.title, 'http:localhost:3002/');
  server.resetHandlers();
})
afterAll(() => server.close());

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  localStorage.clear();
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <AdminMenu/>
    </UserContext.Provider>
  );
};

test('Renders', async () => {
  renderView();
});

test('Logout Rendered on Signed In User', async () => {
  renderView();
  await waitFor(() => {
    screen.getByTestId('Anna Admin');
    fireEvent.click(screen.getByTestId('Anna Admin'));
  });
  await screen.findByTestId('avatar');
  await fireEvent.click(screen.getByText('Logout'));
});
