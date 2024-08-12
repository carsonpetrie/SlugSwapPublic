import { 
  render, 
  screen, 
} from '@testing-library/react';

import Listings from '../../views/ListingsView';

test('Renders Listings', async () => {
  render(
    <Listings/>
  );
  await screen.findByText('To implement Listings');
});