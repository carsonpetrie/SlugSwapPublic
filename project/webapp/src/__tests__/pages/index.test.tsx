import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import Index from '../../pages/index';
import { getServerSideProps } from '../../pages/index';


const handlers = [
  rest.get('http://localhost:3013/api/v0/category', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(	
        [
          {
            "categoryid": "Vehicles",
            "data": null
          },
          {
            "categoryid": "Computers",
            "data": null
          }
        ]
      )
    ) 
  })
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

const renderView = async () => {
  const { props } = await getServerSideProps(
    {req: { headers: { host: 'localhost:3000'}}})
  render(<Index categories={props.categories} listings={props.listings}/>)
};

test('Renders', async () => {
  renderView()
  await screen.findAllByText('SlugSwap');
});
