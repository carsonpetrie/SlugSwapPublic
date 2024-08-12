// https://mui.com/material-ui/react-list/

import { User } from "../graphql/users/schema";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context";
import { 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Typography, 
  Grid,
  IconButton
} from "@mui/material";
import theme from "../styles/theme";

import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Stack } from "@mui/system";

async function fetchUsers (userCtx : UserContext, setUsers: (users: User[]) => void) {
  const bearerToken = userCtx.loginDetails?.accessToken;
  return fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: `query GetUsers {
      GetUsers {
        userid
        data {
          name
          avatar
          roles
        }
      }
    }` }),
  })
    .then((res) => {
      return res.json()
    }) 
    .then((json) => {
      if(json.data) {
        setUsers(json.data.GetUsers);
      }
    })
} 

export default function UserView() {
  const userCtx = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [blockedUser, setBlockedUser] = useState<string>('');

  const handleDisableUser = (selectedUser: User) => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation disableUser {
      disableUser(input: {userid: "${selectedUser.userid}"}) {
        userid
      }
    }`;
    console.log(selectedUser);
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert('Invalid user.');
        } else {
          setBlockedUser(json.data.disableUser);
          alert(`User ${selectedUser.data.name} has been disabled.`);
        }
      });
  }

  const handleEnableUser = (selectedUser: User) => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation EnableUser {
      enableUser(input: {userid: "${selectedUser.userid}"}) {
        userid
      }
    }`;
    console.log(selectedUser);
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert('Invalid user.');
        } else {
          setBlockedUser(json.data.CreateCategory);
          alert(`User ${selectedUser.data.name} has been enabled.`);
        }
      });
  }

  useEffect(() => {
    if(userCtx) 
      fetchUsers(userCtx, setUsers);
  }, [userCtx, users, blockedUser]);
  return (
    <Grid sx={{mt: 9}} container>
      <Grid item xs={12}>
        <List sx={{ width: '100%', bgcolor: 'background.paper', justifyContent: 'center' }}>
          {users.map((user) => 
            (
              <ListItem key={user.userid} sx={{my: 2}}>
                <ListItemAvatar sx={{mr: 2}}>
                  <Avatar 
                    sx={{width: 100, height: 100}}
                    src={user.data.avatar}>{user.data.name}
                  </Avatar>
                </ListItemAvatar>
                <Stack>
                  <Typography sx={{fontSize: 18, fontWeight: 'bold'}}>{user.data.name}</Typography>
                  <Typography sx={{fontSize: 16}}>USER ID: {user.userid}</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    <Typography sx={{fontSize: 14}}>Roles:</Typography>
                    {user.data.roles.map((role) => (
                      <Typography sx={{fontSize: 14}} key={role}>{`"${role}"`}</Typography>
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      aria-label={`Disable '${user.userid}'`}
                      data-testid={`${user.userid}-Disable`}
                      onClick={() => {
                        handleDisableUser(user);
                      }}
                      sx={{ 
                        width: 32,
                        height: 32,
                        // display: 'block', 
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 1,
                        boxShadow: 1,
                        // Hover color based on Chat GPT code above
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.light,
                          boxShadow: 2,
                          color: '#fff'
                        },
                      }}
                    >
                      <BlockIcon sx={{height: 30, width: 30}}></BlockIcon>
                    </IconButton>
                    <IconButton 
                      aria-label={`Enable '${user.userid}'`}
                      data-testid={`${user.userid}-Enable`}
                      onClick={() => {
                        handleEnableUser(user);
                      }}
                      sx={{ 
                        width: 32,
                        height: 32,
                        // display: 'block', 
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 1,
                        boxShadow: 1,
                        // Hover color based on Chat GPT code above
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.light,
                          boxShadow: 2,
                          color: '#fff'
                        },
                      }}
                    >
                      <CheckCircleIcon sx={{height: 30, width: 30}}></CheckCircleIcon>
                    </IconButton>
                  </Stack>
                </Stack>
              </ListItem>
            )
          )}
        </List>
      </Grid>
    </Grid>
  );
}