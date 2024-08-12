import * as React from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  FormHelperText,
  Box,
  MenuItem,
  useTheme,
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { styled } from '@mui/material/styles';

import { UserSession } from '../../graphql/auth/schema';
import { Category, SubCategory } from '../../graphql/categories/schema';
import FileDropper from '../FileDropper';
import Router from 'next/router';

import { useTranslation } from 'next-i18next'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
  theme: Theme,
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, theme, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}


export default function CreateListing() {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [titleError, setTitleError] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [priceError, setPriceError] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [subcategory, setSubcategory] = React.useState('');
  const [categoryError, setCategoryError] = React.useState(false);
  const [subcategoryError, setSubCategoryError] = React.useState(false);

  const [files, setFiles] = React.useState<File[]>([]);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [subcategories, setSubcategories] = React.useState<SubCategory[]>([]); 

  React.useEffect(() => {
    const query = `query GetCategories{GetCategories {categoryid}}`;
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.data) {
          setCategories(json.data.GetCategories);
        }
      })
  }, []);

  React.useEffect(() => {
    if (category && category != '') {
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
          console.log(json.data.GetSubCategories);
          setSubcategories(json.data.GetSubCategories);
        })
    } 
  }, [category]);

  const priceReg = /^(0\.[0-9]{2}|[1-9][0-9]{0,5}\.[0-9]{2})$/;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitle(event.target.value);
    if(event.target.value.length>0) {
      setTitleError(false);
    } else {
      setTitleError(true);
    }
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDescription(event.target.value);
  }

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setPrice(event.target.value);
    if(priceReg.test(event.target.value)) {
      setPriceError(false);
    } else {
      setPriceError(true);
    }
  }

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCategory(event.target.value);
    // setSubcategory('');
    setCategoryError(false)
  }

  const handleChangeSubCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSubcategory(event.target.value);
    setSubCategoryError(false)
  }

  const saveListing = () => {
    // if user tries to immediately submit
    if (!priceReg.test(price) || title.length===0 || category==='' || subcategory==='') {
      setPriceError(!priceReg.test(price));
      setTitleError(title.length===0);
      setCategoryError(category==='');
      setSubCategoryError(subcategory==='');
      return;
    }
    const item = localStorage.getItem('user');
    if (item) {
      const user: UserSession  = JSON.parse(item);
      const bearerToken = user.accessToken;
      const form = new FormData();
      const query = `mutation CreateListing($images: [File!]!){CreateListing(input: {categoryid: "${category}", subcategoryid: "${subcategory}", title: "${title}", description: "${description}", price: ${price}, images: $images}) {listingid}}`;
      form.append('operations', JSON.stringify({query, "variables": { "images": []} }));
      let map = '{';
      if (files.length) {
        map += `"0":["variables.images.0"]`;
      }
      for(let i = 1; i < files.length; i+=1) {
        map+=`,"${i}":["variables.images.${i}"]`;
      }
      map += '}';
      form.append('map', map);
      for(let i = 0; i < files.length; i+=1) {
        form.append(`${i}`, files[i]);
      }
      fetch('/api/graphql', {
        method: 'POST',
        body: form,
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.errors) {
            alert('Unauthorized!');
          } else {
            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('');
            setSubcategory('');
            setFiles([]);
            handleClose();
            Router.push({
              pathname: `/Listing/${json.data.CreateListing.listingid}`
            })
          }
        });
    }
  }
  return (
    <>
      <Button role={'button'} color="inherit" variant="outlined" sx={{width:'150px'}} onClick={handleClickOpen}>
        {t('cl.new')}
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        theme={theme}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} theme={theme}>
          {t('cl.create')}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin='dense'
            label={t('cl.title')}
            fullWidth
            variant='filled'
            required
            value={title}
            onChange={handleChangeTitle}
            error={titleError}
            inputProps={{'maxLength': 200, 'aria-label': 'Title'}}
            helperText={`${title.length}/200`}
          />
          <TextField
            margin='dense'
            label={t('cl.description')}
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={handleChangeDescription}
            inputProps={{'maxLength': 1000, 'aria-label': 'Description'}}
            helperText={`${description.length}/1000`}
            variant='filled'
          />
          <Box sx={{display: 'flex', justifyContent:'space-between'}}>
            <FormControl required sx={{ width:"45%" }} variant="filled" error={priceError}>
              <InputLabel  htmlFor="filled-adornment-price">{t('cl.price')}</InputLabel>
              <FilledInput
                id="filled-adornment-price"
                value={price}
                margin='dense'
                onChange={handleChangePrice}
                inputProps={{ 'maxLength': 9, 'aria-label': 'Price' }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
              <FormHelperText sx={{marginLeft:'0'}} id="my-helper-text">{t('cl.example')}: 123456.98 or 0.79</FormHelperText>
            </FormControl>
            <TextField
              id="selectCategory"
              select
              required
              aria-label='Select Category'
              label={t('cl.select-cat')}
              sx={{width:'45%'}}
              value={category}
              helperText={t('cl.select-help')}
              variant="standard"
              error={categoryError}
              onChange={handleChangeCategory}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryid} value={category.categoryid}>
                  {t(category.categoryid)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={!category}
              id="selectSubCategory"
              select
              required
              aria-label='Select Subcategory'
              label={t('cl.select-subcat')}
              sx={{width:'45%'}}
              value={subcategory}
              helperText={t('cl.select-subhelp')}
              variant="standard"
              error={subcategoryError}
              onChange={handleChangeSubCategory}
            >
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory.subcategoryid} value={subcategory.subcategoryid}>
                  {subcategory.subcategoryid}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* PLEACE REACT DROP ZONE HERE */}
          <FileDropper files={files} setFiles={setFiles}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveListing}>
            {t('cl.post')}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
