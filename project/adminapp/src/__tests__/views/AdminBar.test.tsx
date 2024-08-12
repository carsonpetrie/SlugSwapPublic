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


import { render, screen, fireEvent } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import { MenuContext, UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';
import AdminBar from '../../views/AdminBar';

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

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  localStorage.clear();
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <MenuContext.Provider value={{
        currentMenu: "categories", setCurrentMenu: (_menu: string|undefined) => {return;},
      }}>
        <AdminBar/>
      </MenuContext.Provider>
    </UserContext.Provider>
  );
};

test('Renders', async () => {
  renderView();
  const logo = await screen.findByText('SlugSwap - Administration');
  fireEvent.click(logo);
  const users = await screen.findByText('Users');
  fireEvent.click(users);
  const categories = await screen.findByText('Categories');
  fireEvent.click(categories);
});
