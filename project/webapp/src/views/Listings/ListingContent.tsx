import * as React from 'react';
import {
  Button,
  Card,
  Grid,
  Typography,
  Box,
  Divider,
  MobileStepper
} from '@mui/material';
import type { Listing } from '../../graphql/listing/schema';

import UserCard from '../User/UserCard'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { RouteContext, UserContext } from '../context';
import Router, { useRouter } from 'next/router';

import { useTranslation } from 'next-i18next'

interface PreviewListingProps {
  listing: Listing
}

const formatTime = (time: string): string => {
  const date = new Date(time);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} @ ` +
    `${date.getHours()}:${date.getMinutes()}`
  );
};

export default function PreviewListing({listing}: PreviewListingProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = React.useContext(UserContext);
  const routeCtx = React.useContext(RouteContext);
  // step code from https://mui.com/material-ui/react-stepper/
  const [activeStep, setActiveStep] = React.useState(0);
  if(listing.data.imgs.length===0) {
    listing.data.imgs[0]='NIA.webp';
  }
  const maxSteps = listing.data.imgs.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <main>
      <Grid container spacing={3} sx={{pt: 10}}>
        {/* IMAGE */}
        <Grid item xs={12} md={8} lg={9} >
          <Card sx={{pl:2}}>
            <Box component="img"
              sx={{
                pl: 2,
                pr: 2,
                pb:2,
                height: 980,
                width: '100%',
                objectFit: 'contain',
              }}
              alt="The image provided for listing by seller."
              src={`http://localhost:3011/images/listing/${listing.data.imgs[activeStep]}`}
            />
            {/* step code from https://mui.com/material-ui/react-stepper/ */}
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  {t('listing.next')}
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft />
                  {t('listing.back')}
                </Button>
              }
            />
            <Typography variant="h6" align="center" gutterBottom>
              {t('listing.this-listing')} {t(listing.categoryid)} {t('listing.category')} 
            </Typography>
          </Card>
        </Grid>
        {/* TITLE, PRICE, SELLER */}
        <Grid item xs={12} md={4} lg={3}>
          <Card
            sx={{
              pl: 2,
              pr: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Typography variant="h3" gutterBottom sx={{fontWeight: 'bold'}}>
              {listing.data.title}
            </Typography>
            <Typography variant="h3" gutterBottom>
              {(listing.data.price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
            </Typography>
            {user?.loginDetails ?
              <>
                <Button variant="contained" sx={{p:1}}>{t('listing.purchase-now')}</Button>
                <p></p>
                <Button variant="contained" sx={{p:1}}>{t('listing.contact-seller')}</Button>
              </>
              :
              <>
                <Button variant="contained" sx={{p:1}}
                  onClick={() => {
                    routeCtx?.setCurrentRoute({pathname: router.pathname, query: router.query});
                    Router.push({
                      pathname: '/SignUp'
                    })
                  }}
                >
                  {t('listing.purchase-now-guest')}
                </Button>
                <p></p>
                <Button variant="contained" sx={{p:1}}
                  onClick={() => {
                    routeCtx?.setCurrentRoute({pathname: router.pathname, query: router.query});
                    Router.push({
                      pathname: '/Login'
                    })
                  }}
                >
                  {t('listing.contact-seller-guest')}
                </Button>
              </>
            }
            <Typography variant="h6" gutterBottom sx={{pt: 4}}>
              {t('listing.posted-on')}: {formatTime(listing.data.dateCreated)}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{pt: 4}}>
              {t('listing.description')}:
            </Typography>
            <Divider/>
            <Typography variant="body1" gutterBottom sx={{pt: 1}}>
              {listing.data.description}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{pt: 4}}>
              {t('listing.seller')}:
            </Typography>
            <Divider/>
            <UserCard userid={listing.posterid}/>
          </Card>
        </Grid>
      </Grid>
    </main>
  );
}