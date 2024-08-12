/*
#######################################################################
#
# Copyright (C) 2022-2023 Carson E. Petrie. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {
  AppBar,
  Grid,
  useTheme,
} from '@mui/material';
import CategoryBar from './CategoryBar';

import Head from 'next/head';
import { useState, useEffect } from 'react';

import { Category } from '../graphql/categories/schema';
import ListingCard from './Listings/ListingCard';
import { Listing } from '../graphql/listing/schema';

import MainBar from './MainBar';

type StatProps = {
  categories: Category[],
}


const fetchListings = async (setListings: (listings: Listing[]) => void) => {
  fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query: 'query GetListings{GetListings {listingid, categoryid, posterid, data{imgs, price, title, dateCreated}}}' }),
  })
    .then((res) => {
      return res.json();
    }) 
    .then((json) => {
      if (json.data) {
        setListings(json.data.GetListings);
      }
    })
}

export default function Home({categories} : StatProps) {
  const [listings, setListings] = useState<Listing[]>([]);

  const theme = useTheme();
  
  useEffect(() => {
    fetchListings(setListings);
  }, []);

  return (
    <>
      <Head>
        <title>SlugSwap - Home</title>
      </Head>
      <AppBar
        position="fixed"
        sx={{ width: '100%',
          backgroundColor: theme.palette.primary.main
        }}
      >
        <MainBar/>
        <CategoryBar categories={categories}/>
      </AppBar>
      <Grid container spacing={1} sx={{mt: 16.2,}}>
        { listings
          .map((listing) => (
            <Grid xs={6} sm={4} md={3} lg={3} xl={2} item key={listing.listingid}>
              <ListingCard listing={listing}/>
            </Grid>
          ))
        }
      </Grid>
    </>
  )
}
