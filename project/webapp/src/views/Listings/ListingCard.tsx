// https://mui.com/material-ui/react-card/

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';
import { Listing } from '../../graphql/listing/schema';

import Router from 'next/router';

type ListingCardProps = {
  listing: Listing,
}

export default function ListingCard({listing}: ListingCardProps) {
  if(listing.data.imgs.length===0) {
    listing.data.imgs[0]='NIA.webp';
  }
  return (
    <Card>
      <CardActionArea onClick={() => {
        Router.push({
          pathname: `/Listing/${listing.listingid}`,
        })
      }}>
        {listing.data.imgs[0] && (
          <CardMedia
            component="img"
            height="220"
            image={`http://localhost:3011/images/listing/${listing.data.imgs[0]}`}
            alt={listing.data.title}
          />
        )}
        <CardContent>
          <Typography noWrap gutterBottom variant="h5" component="div">
            {listing.data.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box component={'span'}>
              {listing.data.price ? (listing.data.price).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'Free'}
            </Box>
            <Box component={'span'}>
              {formatTime(listing.data.dateCreated)}
            </Box>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function formatTime(time: string): string {
  const cmpDay = new Date();
  cmpDay.setHours(0, 0, 0, 0);
  const date = new Date(time);
  let times = cmpDay.getTime();
  if (date.getTime() >= times) {
    return 'Today';
  }
  cmpDay.setDate(cmpDay.getDate() - 1);
  times = cmpDay.getTime();
  if (date.getTime() >= times) {
    return 'Yesterday';
  }
  cmpDay.setDate(cmpDay.getDate() + 1);
  cmpDay.setFullYear(cmpDay.getFullYear() - 1);
  times = cmpDay.getTime();
  if (date.getTime() >= times) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
      `${months[date.getMonth()]} ` +
      `${date.getDate()}`
    );
  }
  return `${date.getFullYear()}`;
}
