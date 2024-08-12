import { 
  render, 
  screen, 
  fireEvent,  
} from '@testing-library/react';
import 'whatwg-fetch';

import EnumCheckbox from '../../views/EnumCheckbox';

jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: 'Honda', category: 'Vehicles', subcategory: 'Cars & Trucks', Transmission: ["TRUE", "Manual"], Condtion: ["TRUE", "New", "Old"],}
  })
}))

test('Click Current Attribute Checkbox', async () => {
  render (
    <EnumCheckbox attribute={'Transmission'} option={'Automatic'} enabled={false}/>
  );
  fireEvent.click(screen.getByText('Automatic'));
});

test('Click New Attribute Checkbox', async () => {
  render (
    <EnumCheckbox attribute={'Make'} option={'Honda'} enabled={false}/>
  );
  fireEvent.click(screen.getByText('Honda'));
});

test('Disable Current Attribute Checkbox', async () => {
  render (
    <EnumCheckbox attribute={'Transmission'} option={'Manual'} enabled={true}/>
  );
  fireEvent.click(screen.getByText('Manual'));
});

test('Disable Current Attribute Checkbox', async () => {
  render (
    <EnumCheckbox attribute={'Condtion'} option={'New'} enabled={true}/>
  );
  fireEvent.click(screen.getByText('New'));
});

test('Disable New Attribute Checkbox', async () => {
  render (
    <EnumCheckbox attribute={'Make'} option={'Honda'} enabled={true}/>
  );
  fireEvent.click(screen.getByText('Honda'));
});