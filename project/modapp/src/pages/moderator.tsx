import * as React from 'react';
import { 
  AppBar,
} from '@mui/material';

import {ThemeProvider} from '@mui/material/styles';
import homeTheme from '../styles/theme';

import {useContext} from 'react';
import { UserContext } from '../views/context';
import AdminBar from '../views/AdminBar';
import ListingsView from '../views/ListingsView';
import Link from 'next/link'

const theme = homeTheme;

export default function Moderator() {
  const userCtx = useContext(UserContext);

  if(!(userCtx) || !(userCtx?.loginDetails?.roles.includes("moderator"))) { 
    return (<Link href="/Login">Unauthorized! Click Here To Login</Link>);
  } else {
    return (
      <ThemeProvider theme={theme}>
        <AppBar
          position="sticky"
          sx={{ width: '100%',
            backgroundColor: (theme) => theme.palette.primary.main
          }}
        >
          <AdminBar/>
        </AppBar>
        <ListingsView/>
      </ThemeProvider>
    );
  }
}