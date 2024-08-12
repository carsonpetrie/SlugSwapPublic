import * as React from 'react';
import { useRouter } from 'next/router'
import {
  AppBar,
  Box,
  Grid,
} from '@mui/material';
import { GraphQLClient, gql } from 'graphql-request';
import MainBar from '../../views/MainBar';
import { Listing } from '@/graphql/listing/schema';
import ListingCard from '../../views/Listings/ListingCard';
import CategoryBar from '../../views/CategoryBar';
import FilterSelect from '../../views/FilterSelect';
import { Category, SubCategory } from '@/graphql/categories/schema';
import { useTheme } from '@mui/material/styles';

import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const fetchSearch = async (searchQuery: string, categoryQuery: string, setResults: (results: Listing[]) => void, subcategoryQuery?: string, attributeQuery?: string) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
  })
  const query = gql`
    query GetListings{
      GetListings(`
        + (searchQuery ? `listingTitle: {title: "${searchQuery}"}` : ``)
        + (`listingCategory: {category: "${categoryQuery}"}`)
        + (categoryQuery && subcategoryQuery ? `listingSubCategory: {subcategory: "${subcategoryQuery}"}` : ``)
        + (categoryQuery && subcategoryQuery && attributeQuery ? `listingAttributes: {attributes: "${attributeQuery}"}` : ``)
        + `) {
        listingid,
        posterid,
        categoryid,
        data { title, imgs, description, price, pending, dateCreated }
    }
  }
  `;
  const data = await graphQLClient.request(query);
  setResults(data.GetListings);
}

const fetchCategories = async (setCategories: (categories: Category[]) => void) => {
  fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query: 'query GetCategories{GetCategories {categoryid}}' }),
  })
    .then((res) => {
      return res.json();
    }) 
    .then((json) => {
      setCategories(json.data.GetCategories);
    })
}

const fetchSubcategories = async (category: string, setSubcategories: (subcategories: SubCategory[]) => void) => {
  fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query: `query GetSubCategories {
      GetSubCategories (categoryid: {
        categoryid: "${category}"}) 
        {
        subcategoryid
        } 
    }`}),
  })
    .then((res) => {
      return res.json();
    }) 
    .then((json) => {
      setSubcategories(json.data.GetSubCategories);
    })
}

const fetchAttributes = async (subcategory: string, setAttributes: (attributes: string) => void) => {
  fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query: `query GetAttributes {
      GetAttributes (subcategoryid: {
        subcategoryid: "${subcategory}"}) 
        {
        attributes
        } 
    }`}),
  })
    .then((res) => {
      return res.json();
    }) 
    .then((json) => {
      if (json.data.GetAttributes.attributes != 'null') {
        setAttributes(json.data.GetAttributes.attributes);
      }
      else {
        setAttributes('');
      }
    })
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

function SearchPage() {
  const router = useRouter();
  const fullquery = router.query;
  const search = router.query.q;
  const category = router.query.category || 'All';
  const subcategory = router.query.subcategory;

  const [results, setResults] = React.useState<Listing[]>();
  const [categories, setCategories] = React.useState<Category[]>();
  const [subcategories, setSubcategories] = React.useState<SubCategory[]>([]);
  const [attributes, setAttributes] = React.useState<string>('')
  const theme = useTheme();

  React.useEffect(() => { 
    const searchQuery = search as string;
    const categoryQuery = category as string;
    const subcategoryQuery = subcategory as string;
    const attributeNames = Object.getOwnPropertyNames(fullquery).filter((e) => e !== 'category' && e !== 'subcategory' && e !== 'q');
    if(attributeNames.length > 0) {
      const atts = [];
      for (const name of attributeNames) {
        const attName = router.query[name];
        if (attName && Array.isArray(attName)) {
          atts.push(
            {
              'Name': name, 
              'Contents': attName.filter(function(e:string) {return e !== 'TRUE'})
            }
          );
        }
      }
      fetchSearch(searchQuery, categoryQuery, setResults, subcategoryQuery, JSON.stringify(atts).replaceAll(`"`, `\\"`));
    } else {
      fetchSearch(searchQuery, categoryQuery, setResults, subcategoryQuery);
    }
  }, [search, category, subcategory, fullquery, router.query]);

  React.useEffect(() => {
    const categoryQuery = category as string;
    fetchSubcategories(categoryQuery, setSubcategories);
  }, [category]);

  React.useEffect(() => {
    if (subcategory) {
      const sub = subcategory as string;
      fetchAttributes(sub, setAttributes);
    } else {
      setAttributes('');
    }
  }, [subcategory]);

  React.useEffect(() => {
    fetchCategories(setCategories);
  }, []);

  if (results && categories) {
    return (
      <>
        <Head>
          <title>{`SlugSwap - Search`}</title>
        </Head>
        {/* https://stackoverflow.com/a/54345581 for appbar zindex */}
        <AppBar
          position="fixed"
          sx={{width: '100%', zIndex: theme.zIndex.drawer+1,
            backgroundColor: (theme) => theme.palette.primary.main}}
        >
          <MainBar/>
          <CategoryBar categories={categories}/>
        </AppBar>
        <Box sx={{ display: 'flex' }}> 
          <Box>
            <FilterSelect subcategories={subcategories} attributes={attributes}/>
          </Box>
          <Box
            sx={{ flexGrow: 1, bgcolor: 'background.default', }}
          >
            <Grid container spacing={1} sx={{mt: 16.2,}}>
              { results
                .map((listing) => (
                  <Grid xs={7} sm={5} md={3} lg={3} xl={2} item key={listing.listingid}>
                    <ListingCard listing={listing}/>
                  </Grid>
                ))
              }
            </Grid>  
          </Box>  
        </Box>
      </>  
    )
  } else {
    return <></>;
  }
}

export default SearchPage;


