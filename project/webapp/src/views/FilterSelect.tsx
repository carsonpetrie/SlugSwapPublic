import { Divider, Drawer, List, Toolbar, ListItem, ListItemButton, ListItemText, Box} from '@mui/material';
import * as React from 'react';
import Router, { useRouter } from 'next/router'

import { SubCategory } from '../graphql/categories/schema';
import { useTranslation } from 'next-i18next'
import EnumCheckbox from './EnumCheckbox';

type StatProps = {
  subcategories: SubCategory[],
  attributes: string
}
  
type Attribute = {
  name: string
  type: string
  contents: string[]
}

export default function FilterSelect({subcategories, attributes} : StatProps) {
  const { t } = useTranslation("categories");
  const router = useRouter();

  let atts:Attribute[] = [];
  if (attributes && attributes != '') {
    atts = JSON.parse(attributes).ATTRIBUTES;
  }

  if (router.query.category === 'All') {
    return (<></>)
  } else {
    return (
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar/>
        <Toolbar/>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              const q = router.query;
              delete q.subcategory;
              Router.push({
                pathname: `/search`,
                query: q
              })
            }}>
              <ListItemText>
                {t(`Subcategories.${'All ' + String(router.query.category) + ' Listings'}`)}
              </ListItemText>
            </ListItemButton>
          </ListItem>
          {subcategories && subcategories.map((subcategory) => (
            <ListItem key={subcategory.subcategoryid} disablePadding>
              <ListItemButton onClick={() => {
                const q = router.query;
                q.subcategory = subcategory.subcategoryid;
                Router.push({
                  pathname: `/search`,
                  query: q
                })
              }}>
                <ListItemText>
                  {t(`Subcategories.${subcategory.subcategoryid}`)}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ml:2}}>
          {atts.map((attribute:Attribute) => (
            <Box key={attribute.name}>
              <ListItem disablePadding>
                <ListItemText primary={attribute.name} />
              </ListItem>
              <List sx={{ml:1.5}}>
                {attribute.contents.map((option:string) => (
                  <ListItem key={option} disablePadding>
                    <EnumCheckbox attribute={attribute.name} option={option} enabled={false}/>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </List>
      </Drawer>
    );
  }
}