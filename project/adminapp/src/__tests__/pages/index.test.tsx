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

import { render, screen } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import Index from '../../pages/index';

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
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = async () => {
  render(<Index/>)
};

test('Renders', async () => {
  renderView()
  await screen.findAllByText('Admin Log In')
});
