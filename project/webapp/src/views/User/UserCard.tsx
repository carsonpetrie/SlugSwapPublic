import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardHeader,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { gql, GraphQLClient } from 'graphql-request';
import { UserData } from '@/graphql/user/schema';
import { CardActionArea } from '@mui/material';
import Router from 'next/router';

import { useTranslation } from 'next-i18next'

const fetchUserDetails = async (userid: string, setUserInfo: (userInfo: UserData) => void, setError: (error: boolean) => void) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
  })
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
  `;
  try {
    const data = await graphQLClient.request(query);
    setUserInfo(data.GetUser);
  }
  catch {
    setError(true);
  }
}

interface UserCardProps {
  userid: string
}

export default function UserCard({userid}: UserCardProps) {
  const { t } = useTranslation('common');
  const [userInfo, setUserInfo] = useState<UserData|undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    fetchUserDetails(userid, setUserInfo, setError)
  }, [userid])

  const CardDisplay = () => {
    if (userInfo) {
      const CardDescription = () => {
        return (
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              { userInfo.description }
            </Typography>
          </CardContent>
        ) 
      }
      const date = new Date(userInfo.timestamp)
      const month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
      return (
        <Card sx={{ maxWidth: 400 }}>
          <CardActionArea onClick={() => {
            Router.push({
              pathname: `/User/${userid}`,
            })
          }}>
            <CardHeader
              title={userInfo.name}
              subheader={`${t('user.member-since')}: ${month[date.getMonth()-1]} ${date.getFullYear()}`}
            />
            <CardMedia
              component="img"
              height="194"
              image={ userInfo.avatar }
              alt={ userInfo.name }
            />
            <CardDescription />
          </CardActionArea>
        </Card>
      )
    } else if (error) {
      return <>{"Failed to load usercard"}</>;
    } else {
      return <>{"Loading"}</>;
    }
  }

  return (
    <CardDisplay/>
  )
}
