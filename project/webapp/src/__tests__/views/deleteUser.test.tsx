import { render, screen, fireEvent } from '@testing-library/react';
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
  }),

  graphql.mutation('deleteUser', async (req, res, ctx) => {
    if(req.headers.get('authorization') !== 'Bearer admin') {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      );
    } else {
      return res(
        ctx.data({
          deleteUser: {
            userid: "0874daf0-5b0d-4c91-be85-1b88acd226d6",
          }
        }),
      )
    }

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
  await screen.findByText('Anna Admin');
});

test('Delete User', async () => {
  localStorage.setItem('user', JSON.stringify({"name":"Anna","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJhYTMyNzExMy0wOWI5LTRlMjUtOWM5ZS05M2FkMzk3ZWVlOWQiLCJuYW1lIjoiQW5uYSBBZG1pbiIsInJvbGVzIjpbIm1lbWJlciIsImFkbWluIl0sImlhdCI6MTY3NjUwOTAxNiwiZXhwIjoxNjc2NTEwODE2fQ.SB_Emo87k1vlRU2nhxkYTCx7sLXwL4O5SJpq7u_80Wg"}));
  renderView()

  const createButton = await screen.findAllByLabelText('delete');
  fireEvent.click(createButton[0]);

  renderView()
     
  await screen.findByText('Molly Member');

})
