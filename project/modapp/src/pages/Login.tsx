import Router from 'next/router';
import { 
  Button,
  TextField,
} from '@mui/material';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import homeTheme from '../styles/theme';
import { ThemeProvider } from '@emotion/react';

import {
  useContext, 
} from "react";
import { 
  UserContext,
} from '../views/context';

const theme = homeTheme;

export default function Login() {
  const userCtx = useContext(UserContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = {query: `query Login{Login(email: "${data.get('email')}", password: "${data.get('password')}") { name, accessToken, userid, roles }}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          console.log('-> ', json.errors);
          alert('Error logging in, please try again');
        } else {
          localStorage.setItem('user', JSON.stringify(json.data.Login));
          userCtx?.setLoginDetails(json.data.Login);
          if(json.data.Login.roles?.includes('moderator')) {
            Router.push({
              pathname: '/moderator'
            })
          } else {
            alert("Invalid login. Please try again.");
            userCtx?.setLoginDetails(undefined);
            localStorage.removeItem('user');
          }
        }
      })
  };

  return (   
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Moderator Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              inputProps={{'aria-label': 'Email Address'}}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              inputProps={{'aria-label': 'Password'}}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.secondary.light,
                  color: '#fff'
                },
              }}
            >
              Log In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}