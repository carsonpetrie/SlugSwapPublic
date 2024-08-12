import Router, { useRouter } from 'next/router'
import {
  Paper,
  TextField,
  IconButton,
  Divider,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import React, { useContext, useEffect, useState } from 'react';
import {SearchContext} from './context';
import { CategoryContext } from './context';

import { useTranslation } from 'next-i18next'


export default function SearchBar() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const searchCtx = useContext(SearchContext);
  const categoryCtx = useContext(CategoryContext)
  const [newSearch, setNewSearch] = useState<string>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    let m = newSearch;
    m = value;
    setNewSearch(m);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(searchCtx?.currentSearch) {
      const searchQuery = searchCtx?.currentSearch;
      const categoryQuery = categoryCtx?.currentCategory;
      const q = router.query;
      q.q = searchQuery
      q.category = categoryQuery;
      Router.push({
        pathname: `/search`,
        query: q
      })
    }
    else {
      const q = router.query;
      delete q.q
      Router.push({
        pathname: `/search`,
        query: q
      })
    }
  }

  useEffect(() => {
    setNewSearch(searchCtx?.currentSearch);
  }, [searchCtx]);

  return (
    <Paper sx={{marginLeft: "auto", display: "flex"}} 
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField 
        // fullWidth
        size="small"
        data-testid="search"
        label={t('search')}
        variant="filled"
        value={newSearch}
        inputProps={{'aria-label': 'SearchBar'}}
        sx={{marginLeft: "auto"}}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: 
          <InputAdornment position='end'>
            {newSearch && <IconButton
              data-testid='clear'
              onClick={()=>{
                setNewSearch('');
                searchCtx?.setCurrentSearch('');
                const q = router.query;
                delete q.q
                Router.push({
                  pathname: `/search`,
                  query: q
                })
              }}
            >
              <ClearIcon />
            </IconButton>
            }
            <Divider sx={{ height: 37, m: 0.5 }} orientation='vertical' />
            <IconButton
              type="submit"
              data-testid="send"
              aria-label="submit"
              onClick={()=>{searchCtx?.setCurrentSearch(newSearch)}}
              sx={{pl: 1, pr: 1}}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }}
      >
      </TextField>
    </Paper>
  )
}