import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material';

import Router from 'next/router';
import Head from 'next/head';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../views/context';
import { RouteContext } from '../views/context';

import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common', 'footer', 'categories', 'login'
      ])),
    },
  }
}

export default function SignIn() {
  const { t } = useTranslation('login');
  const userCtx = useContext(UserContext);
  const routeCtx = useContext(RouteContext);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
  }, []);
  
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
          alert(t('error'));
        } else {
          localStorage.setItem('user', JSON.stringify(json.data.Login));
          userCtx?.setLoginDetails(json.data.Login);
          Router.push({
            pathname: routeCtx?.currentRoute.pathname, query: routeCtx?.currentRoute.query
          })
        }
      })
  };
  if (loading) {
    // done to allow react enough time to render
    // prevents 'Loading initial props cancelled' error to be outputted
    return <></>;
  } else if (userCtx?.loginDetails) {
    Router.push({
      pathname: routeCtx?.currentRoute.pathname, query: routeCtx?.currentRoute.query
    });
    return <>SENT TO HOMEPAGE</>
  } else {
    return (
      <>
        <Head>
          <title>Login</title>
        </Head>
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
              {t('login')}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('email')}
                inputProps={{ 'aria-label': 'Email Address' }}
                name="email"
                autoComplete="email"
                autoFocus />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('password')}
                inputProps={{ 'aria-label': 'Password' }}
                type="password"
                id="password"
                autoComplete="current-password" />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={t('remember')} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mt: 3, mb: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.light,
                    color: '#fff'
                  },
                }}
              >
                {t('login')}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 0, mb: 2 }}
                onClick={() => {
                  Router.push({
                    pathname: routeCtx?.currentRoute.pathname, query: routeCtx?.currentRoute.query
                  });
                } }
              >
                {t('cancel')}
              </Button>
              <Grid container>
                <Grid item>
                  <Link variant="body2" sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      Router.push({
                        pathname: '/SignUp'
                      });
                    } }
                  >
                    {t('signup')}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </>
    );
  }
}
