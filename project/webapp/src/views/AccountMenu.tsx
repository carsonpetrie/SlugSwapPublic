// Modified from: https://mui.com/material-ui/react-menu/#AccountMenu.tsx

import Router from 'next/router'
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Grid,
} from '@mui/material';

import { useContext, useEffect, useState } from 'react';
import { UserContext } from './context';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { RouteContext } from '../views/context';
import { UserSession } from '@/graphql/auth/schema';
import { gql, GraphQLClient } from 'graphql-request';
import { UserData } from '@/graphql/user/schema';

import { useTranslation } from 'next-i18next';

const fetchData = async (loginDetails: UserSession|undefined, setUser: ((user: UserSession|undefined) => void)|undefined, setDetails: (details: UserData) => void) => {
  
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
    headers: {
      Authorization: `Bearer ${loginDetails?.accessToken}`,
    },
  })
  const query = gql`
    query GetUser {
      GetUser(userid: "${loginDetails?.userid}") {
        name
        avatar
        roles
        timestamp
        description
      }
    }
  `
  const data = await graphQLClient.request(query);
  setDetails(data.GetUser);
}

export default function AccountMenu() {
  const { t } = useTranslation('common');
  const ctx = useContext(UserContext);  // Grab the user details 
  const routeCtx = useContext(RouteContext);
  const [detailsState, setDetails] = useState<UserData>();
  useEffect(() => {
    fetchData(ctx?.loginDetails, ctx?.setLoginDetails, setDetails)
      .catch(console.error)
  }, [ctx])

  const logout = ()  => {
    ctx?.setLoginDetails(undefined);
    localStorage.removeItem('user');
    Router.push({
      pathname: routeCtx?.currentRoute.pathname, query: routeCtx?.currentRoute.query
    });
  }

  // Account Menu stuff
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return(
    <Grid>
      <Box
        sx={{
          width: '50%',
          height: '10%'
        }}
      >
        <Tooltip title={t('menu.account')}>
          <Button variant='text'
            data-testid={ctx?.loginDetails?.name}
            onClick={handleClick}
          >
            <Avatar 
              data-testid={detailsState?.avatar}
              aria-label={detailsState?.name}
              src={detailsState?.avatar}
              alt={ctx?.loginDetails?.name}
              sx={{
                width: 30,
                height: 30,
                bgcolor: '#fff',
                color: (theme) => theme.palette.primary.main
              }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
            </Avatar>
            <ExpandMoreIcon color='secondary'/>
          </Button>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 240,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 10,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          Router.push({
            pathname: `/User/${ctx?.loginDetails?.userid}`,
          });
          handleClose;
        }}>
          <Avatar /> {t('menu.profile')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('menu.settings')}
        </MenuItem>
        <MenuItem onClick={() => {logout()}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('menu.logout')}
        </MenuItem>
      </Menu>
    </Grid>
  );
}