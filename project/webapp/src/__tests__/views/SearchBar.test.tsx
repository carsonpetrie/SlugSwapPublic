import { SearchContext } from '../../views/context';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

// import { getServerSideProps } from '../../pages/index';
import SearchBar from '../../views/SearchBar';

const handlers = [
  graphql.query('GetCategories', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetCategories: []
      }),
    )
  }),
  graphql.query('GetListings', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetListings: [
          {
            "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6", 
            "categoryid": "Vehicles",
            "data": {
              "title": "2017 Honda Civic", 
              "price": 10000.00, 
              "imgs": ["https://i.imgur.com/X73z6UW.jpeg"],
            },
          },
          {
            "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d7",
            "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6", 
            "categoryid": "Vehicles",
            "data": {
              "title": "2018 Honda Civic",
              "imgs": [],
            },
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

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: 'Honda'}
  })
}))

const renderView = async () => {
  render(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <SearchContext.Provider value={{currentSearch: '', setCurrentSearch: (search: string|undefined) => {null}}}>
      <SearchBar/>
    </SearchContext.Provider>
  )
};

test('Input Search', async () => {
  renderView();
  // screen.debug(undefined, Infinity);
  const textbox = screen.getByLabelText('SearchBar');
  await userEvent.type(textbox, 'Honda');
  await waitFor(() => {
    expect(textbox).toHaveValue('Honda');
  });
  fireEvent.click(screen.getByTestId('send'));
});

test('Search Push with Context', async () => {
  render(
    <SearchContext.Provider value={{currentSearch: 'Honda', setCurrentSearch: () => {null}}}>
      <SearchBar/>
    </SearchContext.Provider>);
  // screen.debug(undefined, Infinity);
  fireEvent.click(screen.getByTestId('send'));
});

test('Clear Search', async () => {
  renderView();
  const textbox = screen.getByLabelText('SearchBar');
  await userEvent.type(textbox, 'Honda');
  await waitFor(() => {
    expect(textbox).toHaveValue('Honda');
  });
  fireEvent.click(screen.getByTestId('clear'));
  expect(textbox).toHaveValue('');
})