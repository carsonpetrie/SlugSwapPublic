import * as React from 'react';
import  PreviewListing from '../../views/Listings/ListingContent'
import { AppBar, useTheme } from '@mui/material';
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import { GraphQLClient, gql } from 'graphql-request';
import { Listing as ListingItem } from '../../graphql/listing/schema';
import Error from 'next/error';
import MainBarListing from '../../views/Listings/MainBarListing';
import Head from 'next/head';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { UserContext } from '../../views/context';

import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const fetchListing =  async (listingID:string, setListing: (listing: ListingItem) => void, setError: (error: boolean) => void) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})
  const query = gql`
    query GetListing {
      GetListing (listingID: {listingid: "${listingID}"}) {
        listingid
        categoryid
        posterid
          data {
          title
          description
          dateCreated
          price
          imgs
          pending
        }
      }
    }
  `
  try {
    const data = await graphQLClient.request(query);
    setListing(data.GetListing);
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

export default function Listing() {
  const router = useRouter();
  const [listing, setListing] = React.useState<ListingItem|undefined>(undefined);
  const [error, setError] = React.useState(false);
  const open = true
  const theme = useTheme();
  const userCtx = React.useContext(UserContext);


  React.useEffect(() => {
    if (router.query.listingid) {
      const id = router.query.listingid as string;
      fetchListing(id, setListing, setError);
    }
  }, [router.query.listingid]); 

  console.log('-> ', listing, listing?.data.pending, !userCtx?.loginDetails?.roles.includes("moderator"), ' <-');

  if (listing && (listing.data.pending == "true" && !userCtx?.loginDetails?.roles.includes("moderator"))) {
    return (
      <>
        <Head>
          <title>{`SlugSwap - ${listing.data.title}`}</title>
        </Head>
        <Box >
          <AppBar
            position="fixed"
            sx={{ width: '100%',
              backgroundColor: theme.palette.primary.main}}
          >
            <MainBarListing/>
          </AppBar>
        </Box>
        <Box sx={{ filter: "blur(12px)", width: "100%"}}>
          <PreviewListing listing={listing} />
        </Box>
        <Dialog open={open} sx={{zIndex: 1000}}>
          <DialogTitle> Uh Oh... </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This listing has been flagged and is pending moderator approval.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    )
  } else if (listing) {
    return (
      <>
        <Head>
          <title>{`SlugSwap - ${listing.data.title}`}</title>
        </Head>
        <Box >
          <AppBar
            position="fixed"
            sx={{ width: '100%',
              backgroundColor: theme.palette.primary.main}}
          >
            <MainBarListing/>
          </AppBar>
        </Box>
        <Box>
          <PreviewListing listing={listing} />
        </Box>
      </>
    ) 
  } else if (error) {
    return (
      <>
        <Head>
          <title>SlugSwap - Listing with id does not exist</title>
        </Head>
        <Error statusCode={404} />
      </>
    );
  } else {
    return(
      <>
        <Head>
          <title>Loading listing...</title>
        </Head>
      Loading listing...
      </>
    );
  }
}