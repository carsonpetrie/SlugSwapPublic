
import { render, screen } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import ListUsers from '../../views/User/ListUsers';

const handlers = [
  graphql.query('GetUsers', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetUsers: [
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "name": "Molly Member",
              "roles": [
                "member"
              ]
            }
          },
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "data": {
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "name": "Anna Admin",
              "roles": [
                "member",
                "admin"
              ]
            }
          },
          {
            "userid": "1910e77b-3306-4103-94c9-4ef0bbd67efd",
            "data": {
              "avatar": "https://i.imgur.com/YtV7rVh.png",
              "name": "Nobby Nobody",
              "roles": []
            }
          }
        ]
      }),
    )
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(<ListUsers/>)
};

test('UserList Loads', async () => {
  localStorage.setItem('user', `{"name":"Anna Admin","accessToken":"whatever"}`)
  renderView()
  await screen.findByText('Anna Admin')
});
