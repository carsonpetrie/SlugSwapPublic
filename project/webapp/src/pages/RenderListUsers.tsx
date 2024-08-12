
import { Typography } from '@mui/material';
import ListUsers from '../views/User/ListUsers'

export default function RenderListUsers() {
  return (
    <>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        This is a testing page to render the ListUsers View.
      </Typography>
      <ListUsers/>
    </>  
  )
}