import * as React from 'react';
import { 
  AppBar, Toolbar,
} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import homeTheme from '../styles/theme';

import {useContext} from 'react';
import { MenuContext } from '../views/context';
import AdminBar from '../views/AdminBar';
import UserView from '../views/UserView';
import CategoryView from '../views/CategoryView';

const theme = homeTheme;

export default function Admin() {
  // const userCtx = useContext(UserContext);
  const menuCtx = useContext(MenuContext);

  const CurrentMenu = () => {
    if (menuCtx?.currentMenu == 'categories') {
      return (
        <CategoryView/>
      );
    } else if (menuCtx?.currentMenu == 'users') {
      return (
        <UserView/>
      )
    } else {
      return (
        <>
          <Toolbar/>
          NO MENU SELECTED
        </>
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        sx={{ width: '100%',
          backgroundColor: (theme) => theme.palette.primary.main
        }}
      >
        <AdminBar/>
      </AppBar>
      <CurrentMenu/>
    </ThemeProvider>
  );
}