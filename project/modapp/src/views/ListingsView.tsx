import { Listing } from "../graphql/listing/schema";
import { UserContext } from './context';
import * as React from 'react';
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FlagIcon from '@mui/icons-material/Flag';
import DoneIcon from '@mui/icons-material/Done';

export default function Listings() {

  const [pendingListings, setPendingListings] = React.useState<Listing[]>([]);
  const [approvedListings, setApprovedListings] = React.useState<Listing[]>([]);
  const ctx = React.useContext(UserContext);
  const accessToken = ctx?.loginDetails?.accessToken;

  const queryPendingListings = () => {
    const query = `query GetPendingListings {
      GetPendingListings {
        categoryid
        data {
          dateCreated
          description
          imgs
          price
          title
        }
        listingid
        posterid
      }
    }`
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert('Session Token Has Expired. Please Re-Login');
        } else {
          setPendingListings(json.data.GetPendingListings);
        }  
      });
  }

  const queryApprovedListings = () => {
    const query = `query GetApprovedListings {
      GetApprovedListings {
        categoryid
        data {
          dateCreated
          description
          imgs
          price
          title
        }
        listingid
        posterid
      }
    }`
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert('Session Token Has Expired. Please Re-Login');
        } else {
          setApprovedListings(json.data.GetApprovedListings);
        }  
      });
  }

  React.useEffect(() => {
    queryPendingListings();
    queryApprovedListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApproveListing = (listingid: string) => {
    const query = `mutation ApproveListing {
      ApproveListing (input: {listingid: "${listingid}"}) {
        categoryid
        listingid
        posterid
        data {
          dateCreated
          description
          imgs
          price
          title
        }
      }
    }`;
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const id = json.data.ApproveListing.listingid
        setPendingListings(curListings => curListings.filter(listing => listing.listingid !== id));
        setApprovedListings([...approvedListings, json.data.ApproveListing]);
      });
  }

  const handleFlagListing = (listingid: string) => {
    const query = `mutation FlagListing {
      FlagListing (input: {listingid: "${listingid}"}) {
        categoryid
        listingid
        posterid
        data {
          dateCreated
          description
          imgs
          price
          title
        }
      }
    }`;
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const id = json.data.FlagListing.listingid
        setApprovedListings(curListings => curListings.filter(listing => listing.listingid !== id));
        setPendingListings([...pendingListings, json.data.FlagListing]);
      });
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          m: 1,
          p: 1,
          bgcolor: '#fff', 
          color: 'grey.300', 
          fontSize: '0.875rem',
          fontWeight: '700',
        }}
      >
        <Accordion sx={{ width: '100%', bgcolor: 'background.paper' }} aria-label='accordion'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Listings Pending Approval</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List
              sx={{ width: '100%', bgcolor: 'background.paper' }}
              aria-label="contacts"
            >
              { pendingListings.map((listing) => (
                <ListItem disablePadding key={listing.listingid}>
                  <ListItemButton aria-label={'link' + listing.listingid} onClick={() => {
                    window.open(`http://localhost:3000/Listing/${listing.listingid}`, "_blank");
                  }}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={listing.data.title} secondary={
                      <React.Fragment>
                        <Typography>
                          Category: {listing.categoryid}
                        </Typography>
                        <Typography>
                          Poster: {listing.posterid}
                        </Typography>
                        <Typography>
                          Description: {listing.data.description}
                        </Typography>
                        <Typography>
                          Date Created: {listing.data.dateCreated}
                        </Typography>
                      </React.Fragment>
                    }/>
                  </ListItemButton>
                  <ListItemIcon>
                    <DoneIcon sx={{paddingLeft: '20px'}} aria-label={'approve' + listing.listingid} 
                      onClick={() => {console.log('handle'), handleApproveListing(listing.listingid)}} />
                  </ListItemIcon>
                </ListItem>
              )) }
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        sx={{
          display: 'flex',
          m: 1,
          p: 1,
          bgcolor: '#fff', 
          color: 'grey.300', 
          fontSize: '0.875rem',
          fontWeight: '700',
        }}
      >
        <Accordion sx={{ width: '100%', bgcolor: 'background.paper' }} aria-label='accordion'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Approved Listings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List
              sx={{ width: '100%', bgcolor: 'background.paper' }}
              aria-label="contacts"
            >
              { approvedListings.map((listing) => (
                <ListItem disablePadding key={listing.listingid}>
                  <ListItemButton aria-label={'link' + listing.listingid} onClick={() => {
                    window.open(`http://localhost:3000/Listing/${listing.listingid}`, "_blank");
                  }}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={listing.data.title} secondary={
                      <React.Fragment>
                        <Typography>
                          Category: {listing.categoryid}
                        </Typography>
                        <Typography>
                          Poster: {listing.posterid}
                        </Typography>
                        <Typography>
                          Decsription: {listing.data.description}
                        </Typography>
                        <Typography>
                          Date Created: {listing.data.dateCreated}
                        </Typography>
                      </React.Fragment>
                    }/>
                  </ListItemButton>
                  <ListItemIcon>
                    <FlagIcon sx={{paddingLeft: '20px'}} aria-label={'flag' + listing.listingid} 
                      onClick={() => {console.log('handle'), handleFlagListing(listing.listingid)}} />
                  </ListItemIcon>
                </ListItem>
              )) }            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}
