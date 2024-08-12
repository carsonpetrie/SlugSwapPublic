import * as React from 'react';
import { useRouter } from 'next/router'
import {
  Toolbar,
  useTheme,
  AppBar,
  Card,
  Avatar,
  Typography,
  Grid,
} from '@mui/material';
import { UserData } from '../../graphql/user/schema'
import { GraphQLClient, gql } from 'graphql-request';

import Head from 'next/head';
import Error from 'next/error';

import MainBarListing from '../../views/Listings/MainBarListing';
import { Listing } from '../../graphql/listing/schema';
import ListingCard from '../../views/Listings/ListingCard';

import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December']

const fetchUserData = async (userid: string, setUser: (userData: UserData) => void, setError: (error: boolean) => void) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})
  const query = gql`
    query GetUser {
      GetUser(userid: "${userid}") {
        name
        avatar
        roles
        timestamp
        description
      }
    }
  `
  try {
    const data = await graphQLClient.request(query);
    setUser(data.GetUser);
  } catch {
    setError(true);
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common', 'footer', 'categories', 'login'
      ])),
    },
  }
}

const fetchListings = async (userid: string, setResults: (results: Listing[]) => void) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
  })
  const query = gql`
    query GetListingsByPoster{
      GetListingsByPoster(listingPoster: {posterid: "${userid}"}) {
        listingid,
        posterid,
        categoryid,
        data { title, imgs, description, price, dateCreated }
    }
  }
  `
  try {
    const data = await graphQLClient.request(query);
    console.log(data);
    setResults(data.GetListingsByPoster);
  } catch {
    setResults([]);
  }
}

export default function User() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [user, setUser] = React.useState<UserData>();
  const [results, setResults] = React.useState<Listing[]>([]);
  const [error, setError] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    if (router.query.userid) {
      const id = router.query.userid as string;
      fetchUserData(id, setUser, setError);
      fetchListings(id, setResults);
    }
  }, [router.query.userid]);

  const ListingDisplay = () => {
    if (results.length) {
      return (
        <Grid container spacing={1}>
          { results.map((result) => (
            <Grid xs={6} sm={4} md={3} item key={result.listingid}>
              <ListingCard listing={result}/>
            </Grid>
          ))
          }
        </Grid>
      );
    } else {
      return (<>This User Currently Has No Listings</>);
    }
  }

  if (user) {
    return (
      <>
        <Head>
          <title>{user.name}</title>
        </Head>
        <AppBar
          position="fixed"
          sx={{ width: '100%',
            backgroundColor: theme.palette.primary.main
          }}
        >
          <MainBarListing/>
        </AppBar>
        <Toolbar/>
        <Grid container spacing={1} sx={{mt: 1,}}>
          <Grid item xs={12} lg={3} xl={2.5}>
            <Card>
              <Typography variant="h4" sx={{ m: 1 }}>
                {user?.name} 
              </Typography>
              <Avatar src={user?.avatar} variant="square"
                sx={{ width: 256, height: 256, m: 1 }}/>
              <Typography variant="subtitle1" sx={{ m:1 }}>
                {t('user.member-since')}: {months[new Date(user?.timestamp).getMonth()-1] +' '+ new Date(user?.timestamp).getFullYear()}
              </Typography>
              <Typography variant="body1" sx={{ m:1 }}>
                {user.description}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} lg={9} xl={9.5}>
            <ListingDisplay />
          </Grid>
        </Grid>
      </>  
    )
  } else if (error) {
    return (
      <>
        <Head>
          <title>User with this id does not exist</title>
        </Head>
        <Error statusCode={404} />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Loading user...</title>
        </Head>
        Loading user...
      </>
    );
  }
}