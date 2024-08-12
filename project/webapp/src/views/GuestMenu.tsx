// Modified from: https://mui.com/material-ui/react-menu/#AccountMenu.tsx

import Router, { useRouter } from 'next/router'
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';

import { useState, useContext } from 'react';
import { useTranslation } from 'next-i18next'

import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import CreateIcon from '@mui/icons-material/Create';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RouteContext } from './context';


export default function GuestMenu() {
  const { t } = useTranslation('common');
  const routeCtx = useContext(RouteContext);
  const router = useRouter();

  // Menu stuff
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
        <Tooltip title={t('menu.options')}>
          <Button
            data-testid='guestMenu'
            onClick={handleClick}
          >
            <MenuIcon
              sx={{ color: '#fff' }}
            />
            <ExpandMoreIcon sx={{color: (theme) => theme.palette.secondary.main}}/>
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
          routeCtx?.setCurrentRoute({pathname: router.pathname, query: router.query});
          Router.push({
            pathname: '/SignUp'
          })
        }}
        >
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          {t('menu.signup')}
        </MenuItem>
        <MenuItem onClick={() => {
          routeCtx?.setCurrentRoute({pathname: router.pathname, query: router.query});
          Router.push({
            pathname: '/Login'
          })
        }}
        >
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          {t('menu.login')}
        </MenuItem>
      </Menu>
    </Grid>
  );
}