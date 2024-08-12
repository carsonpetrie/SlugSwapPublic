import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';


import type { User } from '../../graphql/user/schema'

interface UserListItemProps {
  user: User
}

export default function UserListItem({user}: UserListItemProps) {
  //const [userList, setUserList] = useState(user);
  

  const removeUser = () => {
    const item = localStorage.getItem('user')
    if (item) {
    
   

      const userInfo = JSON.parse(item)
      const bearerToken = userInfo.accessToken

      const query = `mutation deleteUser {
        deleteUser(input: {userid: "${user.userid}"}) {userid}}`;
      fetch('/api/graphql', {
        method: 'POST',
        body: JSON.stringify({query}),
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      })
    }
  }

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="?" src={user.data.avatar} />
      </ListItemAvatar>
      <ListItemText primary={user.data.name} secondary={user.userid}> </ListItemText>
      <ListItem
        secondaryAction={
          <IconButton edge="end" role={'button'} aria-label="delete">
            <DeleteIcon />
                      
          </IconButton>
        }

        onClick={() => {
          removeUser()
        }}
      ></ListItem>
    </ListItem>
  );
}