import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import Head from 'next/head';
import Router from 'next/router';

import { RouteContext, UserContext } from '../views/context';

import { useState, useContext, useEffect } from 'react';

import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'es', [
        'common', 'footer', 'categories', 'signup'
      ])),
    },
  }
}

export default function SignUp() {
  const { t } = useTranslation('signup');

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
    const query = {query: `mutation SignUp {SignUp(input: {email: "${data.get('email')}", password: "${data.get('password')}", name:"${data.get('username')}"}) {userid}}`};
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
          Router.push({
            pathname: '/Login'
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
      pathname: '/'
    });
    return <>SENT TO HOMEPAGE</>
  } else {
    return (
      <>
        <Head>
          <title>Sign Up</title>
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
              {t('signup')}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="nickname"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label={t('username')}
                    inputProps={{'aria-label': 'Username'}}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label={t('email')}
                    inputProps={{'aria-label': 'Email Address'}}
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label={t('password')}
                    inputProps={{'aria-label': 'Password'}}
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                color="secondary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.light,
                    color: '#fff'
                  },
                }}
              >
                {t('signup')}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{mt: 0, mb: 2}}
                onClick={() => {
                  Router.push({
                    pathname: routeCtx?.currentRoute.pathname, query: routeCtx?.currentRoute.query
                  })
                }}
              >
                {t('cancel')}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link variant="body2" sx={{cursor:'pointer'}} 
                    onClick={() => {
                      Router.push(
                        {pathname: '/Login'}
                      )
                    }}
                  >
                    {t('login')}
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
