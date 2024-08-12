import { 
  render, 
  screen, 
} from '@testing-library/react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

import Admin from '../../pages/admin';
import { MenuContext, UserContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import mockRouter from 'next-router-mock';

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
          },
        ]
      }),
    )
  }),
  graphql.query('GetUsers', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetUsers: [
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "name": "Molly Member",
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "roles": [
                "member"
              ],
            }
          },
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "data": {
              "name": "Anna Admin",
              "avatar": "https://i.imgur.com/sWFKQnd.jpeg",
              "roles": [
                "member",
                "admin"
              ],
            }
          },
          {
            "userid": "bb123912-09b9-4e25-9c9e-93ad397eee9d",
            "data": {
              "name": "Sally Suspension",
              "avatar": "https://i.imgur.com/Bf9d8QM.jpeg",
              "roles": [
                "member"
              ],
            }
          },
        ]
      }),
    )
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

jest.mock('next/router', () => require('next-router-mock'));
mockRouter.useParser(createDynamicRouteParser([
  // These paths should match those found in the `/pages` folder:
  "/Login",
]));

const renderView = (menuSelected:string) => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <MenuContext.Provider value={{
        currentMenu: menuSelected, setCurrentMenu: (_menu: string) => {return;},
      }}>
        <Admin/>
      </MenuContext.Provider>
    </UserContext.Provider>
  );
};

const renderViewNotAdmin = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Molly Member",accessToken:"whatever", userid:"MOLLYSUUID", roles:["member"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <MenuContext.Provider value={{
        currentMenu: "", setCurrentMenu: (_menu: string|undefined) => {return;},
      }}>
        <Admin/>
      </MenuContext.Provider>
    </UserContext.Provider>
  );
};

test('Renders Not Admin', async () => {
  mockRouter.push('/Login');
  renderViewNotAdmin();
  // await screen.findByText(`You aren't logged in or don't have access to this page!`);
});

test('Renders Users', async () => {
  renderView('users');
});

test('Renders Categories', async () => {
  renderView('categories');
  await screen.findByText('Vehicles');
});

test('Renders No Menu Selected', async () => {
  renderView('');
  await screen.findByText('NO MENU SELECTED');
});
