import { render, screen } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

import { UserContext, CategoryContext, RouteContext} from '../../views/context';
import Home from '../../views/home';

import { UserSession } from '@/graphql/auth/schema';

const handlers = [
  graphql.query('GetListings', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetListings: [
          {
            "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "posterid": "GOODUUID", 
            "categoryid": "Vehicles",
            "data": {
              "title": "2017 Honda Civic",
              "dateCreated": new Date().toISOString(),
              "price": 10000.00, 
              "imgs": ["https://i.imgur.com/X73z6UW.jpeg"],
            },
          },
        ]
      }),
    )
  }),
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
  graphql.query('GetUser', async (req, res, ctx) => {
    const json = await req.json();
    if (json.query.indexOf('ANNASUUID') >= 0) {
      return res(
        ctx.data({
          GetUser: {
            "name": "Anna Admin",
            "avatar": "https://i.imgur.com/a5GQflf.png",
            "roles": ["member", "admin"],
            "timestamp": "2021-05-12 20:00:05",
            "description": "I love apples!"
          }
        }),
      )
    }
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: ''}
  })
}))

const renderView = () => {
  render(
    <RouteContext.Provider value={{
      currentRoute: '/', setCurrentRoute: (_route: string) => {return;}
    }}>
      <UserContext.Provider value={{
        loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
      }}>
        <CategoryContext.Provider value={{
          currentCategory: 'All', setCurrentCategory: (_category: string) => {return;}
        }}>
          <Home
            categories={[
              {
                "categoryid": "Vehicles"
              },
              {
                "categoryid": "Furniture"
              },
              {
                "categoryid": "Clothes"
              }
            ]}
          />
        </CategoryContext.Provider>
      </UserContext.Provider>
    </RouteContext.Provider>
  )
};

test('Renders', async () => {
  renderView();
  await screen.findByText('2017 Honda Civic');
});
