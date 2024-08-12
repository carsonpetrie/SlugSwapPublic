import { render, screen } from '@testing-library/react';
import App from '../../pages/app';
import 'whatwg-fetch';

jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: ''}
  })
}))

function renderView() {
  render(<App
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
  />);
}

test('App Renders', async () => {
  renderView();
  await screen.findAllByText('SlugSwap');
})

test('App Renders with local storage', async () => {
  localStorage.setItem('user', `{"name":"Anna Admin","accessToken":"whatever", "roles":["member", "admin"]}`);
  renderView();
  await screen.findAllByText('SlugSwap');
})