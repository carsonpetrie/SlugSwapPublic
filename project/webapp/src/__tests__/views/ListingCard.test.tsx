import { render, screen, fireEvent } from '@testing-library/react';
import 'whatwg-fetch';

import ListingCard from '../../views/Listings/ListingCard';


jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = async () => {
  const day = new Date();
  const yesterday = new Date();
  yesterday.setDate(day.getDate() - 1);
  const prevMonth = new Date();
  prevMonth.setMonth(day.getMonth() - 1);
  const prevYear = new Date();
  prevYear.setMonth(day.getMonth() - 1);
  prevYear.setFullYear(day.getFullYear() - 1);
  const listings = [
    {
      "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
      "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6", 
      "categoryid": "Vehicles",
      "data": {
        "title": "2017 Honda Civic", 
        "price": 10000.00,
        "dateCreated": day.toISOString(),
        "imgs": ["WHATEVER"],
      },
    },
    {
      "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d7",
      "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6", 
      "categoryid": "Vehicles",
      "data": {
        "title": "2018 Honda Civic",
        "imgs": [],
        "price": 0,
        "dateCreated": yesterday.toISOString(),
      },
    },
    {
      "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d7",
      "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6", 
      "categoryid": "Vehicles",
      "data": {
        "title": "2018 Honda Civic",
        "imgs": [],
        "price": 9999,
        "dateCreated": prevMonth.toISOString(),
      },
    },
    {
      "listingid": "0874daf0-5b0d-4c91-be85-1b88acd226d7",
      "posterid": "0874daf0-5b0d-4c91-be85-1b88acd226d6", 
      "categoryid": "Vehicles",
      "data": {
        "title": "2018 Honda Civic",
        "imgs": [],
        "price": 400,
        "dateCreated": prevYear.toISOString(),
      },
    },
  ]
  // description isn't used nor sent to listing card so error is acceptable
  render(
    <>
      <ListingCard listing={listings[0]}/>
      <ListingCard listing={listings[1]}/>
      <ListingCard listing={listings[2]}/>
      <ListingCard listing={listings[3]}/>
    </>
  )
};

test('Listing Displays', async () => {
  renderView();
  await screen.findByText('$10,000.00');
  await screen.findByText('Free');
});

test('Listing Interactable', async () => {
  renderView();
  await screen.findByText('$10,000.00');
  fireEvent.click(screen.getByText('$10,000.00'));
});
