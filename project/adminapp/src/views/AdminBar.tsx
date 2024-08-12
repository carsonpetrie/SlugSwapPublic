import Router from 'next/router'
import {
  Button,
  Toolbar,
  Typography,
  Stack,
  Grid,
} from '@mui/material';

import {useContext} from 'react';
import { MenuContext } from '../views/context';


import AdminMenu from './AdminMenu';
import Icon from './Icon';


export default function AdminBar() {
  const menuCtx = useContext(MenuContext);

  return (
    <Grid>
      <Toolbar>
        <Icon />
        <Typography 
          variant="h6" noWrap component="div" sx={{cursor:'pointer'}} paddingLeft={1}
          onClick={() => {
            Router.push({
              pathname: '/admin',
            })
          }}
        >
          SlugSwap - Administration
        </Typography>
        <div style={{overflow: 'auto', display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <Stack spacing={2} direction="row" sx={{marginLeft: "auto"}}>
            <Button role={'button'} color="inherit" variant="outlined" sx={{width:'150px', marginLeft: 'auto'}}
              onClick={() => {menuCtx?.setCurrentMenu('users')}}
            >
              Users
            </Button>
            <Button role={'button'} color="inherit" variant="outlined" sx={{width:'150px', marginLeft: 'auto'}}
              onClick={() => {menuCtx?.setCurrentMenu('categories')}}
            >
              Categories
            </Button>
          </Stack>
        </div>
        <Stack spacing={2} direction="row" sx={{marginLeft: "auto"}}>
          <AdminMenu/>
        </Stack>
      </Toolbar>
    </Grid>
  )
}