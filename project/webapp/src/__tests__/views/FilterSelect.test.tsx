import { 
  render, 
  screen, 
  fireEvent,  
} from '@testing-library/react';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch';

import FilterSelect from '../../views/FilterSelect';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next/router', ()=> ({
  push: jest.fn(),
  useRouter: () => ({
    query: {q: 'Honda', category: 'Vehicles'}
  })
}))

const subcategories = [
  {subcategoryid: 'Cars & Trucks', categoryid: 'Vehicles'},
  {subcategoryid: 'Motorcycles', categoryid: 'Vehicles'}
]

const attributes = JSON.stringify(
  {ATTRIBUTES:
    [
      {name: 'Make', contents: ['Honda', 'Toyota']},
      {name: 'Transmission', contents: ['Automatic', 'Manual']},
    ]
  }
)

const renderView = async () => {
  mockRouter.push({pathname: '/search', query: {q: 'Honda', category: 'Vehicles'}});
  render (
    <FilterSelect subcategories={subcategories} attributes={attributes}/>
  );
};

test('Click All', async () => {
  renderView()
  await screen.findByText('Subcategories.All Vehicles Listings')
  fireEvent.click(screen.getByText('Subcategories.All Vehicles Listings')); 
});

test('Click Subcategory', async () => {
  renderView()
  await screen.findByText('Subcategories.Cars & Trucks')
  fireEvent.click(screen.getByText('Subcategories.Cars & Trucks')); 
});

test('Click Attribute', async () => {
  renderView()
  await screen.findByText('Transmission');
});

test('No Attributes', async () => {
  render (
    <FilterSelect subcategories={subcategories} attributes={''}/>
  );
  await screen.findByText('Subcategories.All Vehicles Listings')
});