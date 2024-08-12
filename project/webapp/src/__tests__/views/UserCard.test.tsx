import { render, screen, fireEvent } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import UserCard from '../../views/User/UserCard';

const handlers = [
  graphql.query('GetUser', async (req, res, ctx) => {
    const json = await req.json();
    if (json.query.indexOf('GOODUUID') >= 0) {
      return res(
        ctx.data({
          GetUser: {
            "name": "Molly Member",
            "avatar": "https://i.imgur.com/a5GQflf.png",
            "roles": ["member"],
            "timestamp": "2021-05-12 20:00:05",
            "description": "I love apples!"
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

test('User displays', async () => {
  render(
    <UserCard userid='GOODUUID'/>
  )
  await screen.findByText('Molly Member');
});

test('No userdisplay', async () => {
  render(
    <UserCard userid='BADUUID'/>
  )
  await screen.findByText('Failed to load usercard');
});

test('User Card Interactable', async () => {
  render(
    <UserCard userid='GOODUUID'/>
  )
  fireEvent.click(await screen.findByText('Molly Member'));
});