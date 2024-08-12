import { render, screen } from '@testing-library/react';
import App from '../../pages/app';

test('App Renders', async () => {
  render(<App/>)
  await screen.findAllByText('Moderator Log In');
})
