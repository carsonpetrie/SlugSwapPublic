import { 
  render, 
  screen, 
  fireEvent, 
  // waitForElementToBeRemoved 
} from '@testing-library/react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

import CategoryBar from '../../views/CategoryBar';
// import userEvent from '@testing-library/user-event';

import { UserContext, CategoryContext, SearchContext } from '../../views/context';
import { UserSession } from '../../graphql/auth/schema';

const categories = [
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

const handlers = [
  graphql.query('GetCategories', async (req, res, ctx) => {
    return res(
      ctx.data({
        categories
      }),
    )
  }),
  graphql.query('GetListings', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetListings: []
      }),
    )
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = async () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <CategoryContext.Provider value={{
        currentCategory: 'All', setCurrentCategory: (_category: string) => {return;}
      }}>
        <CategoryBar categories={categories}/>
      </CategoryContext.Provider>
    </UserContext.Provider>
  );
};

const renderViewWithSearch = async () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_userID: UserSession|undefined) => {return;},
    }}>
      <CategoryContext.Provider value={{
        currentCategory: 'All', setCurrentCategory: (_category: string) => {return;}
      }}>
        <SearchContext.Provider value={{
          currentSearch: 'Honda', setCurrentSearch: (_search: string|undefined) => {return;}
        }}>
          <CategoryBar categories={categories}/>
        </SearchContext.Provider>
      </CategoryContext.Provider>
    </UserContext.Provider>
  );
};

test('Click All', async () => {
  renderView()
  fireEvent.click(await screen.findByRole('button', {name: 'All'}));
});

test('Click Category', async () => {
  renderView()
  fireEvent.click(await screen.findByRole('button', {name: 'Vehicles'}));
});

test('Click All With Search', async () => {
  renderViewWithSearch()
  fireEvent.click(await screen.findByRole('button', {name: 'All'}));
});

test('Click Category With Search', async () => {
  renderViewWithSearch()
  fireEvent.click(await screen.findByRole('button', {name: 'Vehicles'}));
});
