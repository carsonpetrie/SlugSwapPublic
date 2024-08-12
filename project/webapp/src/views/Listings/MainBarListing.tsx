import Router from 'next/router';
import {
  Toolbar,
  Typography,
  Stack,
} from '@mui/material';

import { useContext } from 'react';
import AccountMenu from '../AccountMenu';
import { UserContext } from '../context';
import SearchBar from '../SearchBar';
import GuestMenu from '../GuestMenu';

export default function MainBarListing() {
  const ctx = useContext(UserContext);
  const Buttons = () => {
    if (ctx?.loginDetails) {
      return (
        <AccountMenu/>
      )
    } else {
      return (
        <GuestMenu/>
      )
    }
  }

  return (
    <Toolbar>
      <Typography 
        variant="h6" noWrap component="div" sx={{cursor:'pointer'}}
        onClick={() => {
          Router.push({
            pathname: '/',
          })
        }}
      >
        SlugSwap
      </Typography>
      <SearchBar/>
      <Stack spacing={1} direction="row" sx={{ pl: 1, mt: 1, ml: "auto"}}>
        <Buttons/>
      </Stack>
    </Toolbar>
  )
}