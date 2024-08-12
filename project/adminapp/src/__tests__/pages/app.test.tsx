import { render, screen } from '@testing-library/react';
import App from '../../pages/app';
import 'whatwg-fetch';

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
  await screen.findAllByText('Admin Log In');
})

test('App Renders with local storage', async () => {
  localStorage.setItem('user', `{"name":"Anna Admin","accessToken":"whatever", "roles":["member", "admin"]}`);
  renderView();
  await screen.findAllByText('Admin Log In');
})