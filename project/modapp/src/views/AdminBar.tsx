import Router from 'next/router'
import {
  Toolbar,
  Typography,
  Stack,
  Grid,
} from '@mui/material';

import AdminMenu from './AdminMenu';
import Icon from './Icon';

export default function ModBar() {
  return (
    <Grid>
      <Toolbar>
        <Icon />
        <Typography 
          variant="h6" noWrap component="div" sx={{cursor:'pointer'}} paddingLeft={1}
          onClick={() => {
            Router.push({
              pathname: '/moderator',
            })
          }}
        >
          SlugSwap - Moderation
        </Typography>
        <Stack spacing={2} direction="row" sx={{marginLeft: "auto"}}>
          <AdminMenu/>
        </Stack>
      </Toolbar>
    </Grid>
  )
}