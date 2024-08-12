import * as React from 'react';
import List from '@mui/material/List';

import type { User } from '../../graphql/user/schema';
import UserListItem from './UserListItem';
import { GraphQLClient, gql } from 'graphql-request';

const fetchUsers =  async (setUsers:React.Dispatch<React.SetStateAction<User[]>>) => {
  const item = localStorage.getItem('user')
  if (item) { 
    const user = JSON.parse(item)
    const bearerToken = user.accessToken
    const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
    const query = gql`
      query GetUsers {
        GetUsers {
          userid
          data {
            avatar,
            name,
            roles
          }
        }
      }
    `
    const data = await graphQLClient.request(query);
    setUsers(data.GetUsers);
  }
}

export default function ListUsers() {

  const [users, setUsers] = React.useState<User[]>([]);
  React.useEffect(() => {
    fetchUsers(setUsers)
      .catch(console.error)
  }, []);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {users.map((user?) => 
        <UserListItem user={user} key={user.userid}/>
      )}
    </List>
  );
}