import { render, screen } from '@testing-library/react'

import RenderListUsers from '../../pages/RenderListUsers';

const renderView = async () => {
  render(<RenderListUsers />)
};

test('Renders', async () => {
  renderView()
  await screen.findByText('This is a testing page to render the ListUsers View.')
});
