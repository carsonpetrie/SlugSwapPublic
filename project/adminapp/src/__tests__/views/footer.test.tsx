import Footer from "../../views/footer";
import {render, screen} from '@testing-library/react';

test('Render Footer', async () => {
  render(<Footer/>);
  await screen.findByText('SlugSwap');
})