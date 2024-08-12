// https://mui.com/material-ui/react-accordion/
import { 
  Category,
  SubCategory
} from "../graphql/categories/schema";
import theme from "../styles/theme";
import { 
  Grid,
  IconButton,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context";

async function fetchCategories (setCategories: (categories: Category[]) => void) {
  return fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query: 'query GetCategories{GetCategories {categoryid}}' }),
  })
    .then((res) => {
      return res.json()
    }) 
    .then((json) => {
      if(json.data) {
        setCategories(json.data.GetCategories);
      }
    })
} 

const fetchSubCategories = async (category: string, setSubcategories: (subcategories: SubCategory[]) => void) => {
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
      if(json.data) {
        setSubcategories(json.data.GetSubCategories);
      }
    })
}

export default function CategoryView() {
  const userCtx = useContext(UserContext);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setCategory] = useState<string>('');
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [newCategory, setNewCategory] = useState();

  const [selectedSubCategory, setSubCategory] = useState<string>('');
  const [newSubCategory, setNewSubCategory] = useState<string>('');

  useEffect(() => {
    fetchCategories(setCategories);
    fetchSubCategories(selectedCategory, setSubCategories);
  }, [newCategory, newSubCategory, selectedCategory]);

  const [dialogAddOpen, setAddDialogOpen] = useState(false);
  const [dialogAddValue, setAddDialogValue] = useState('');
  const [dialogAddError, setAddDialogError] = useState(true);

  const [dialogEditOpen, setEditDialogOpen] = useState(false);
  const [dialogEditValue, setEditDialogValue] = useState('');
  const [dialogEditError, setEditDialogError] = useState(true);

  const [subDialogAddOpen, setSubAddDialogOpen] = useState(false);
  const [subDialogAddValue, setSubAddDialogValue] = useState('');
  const [subDialogAddError, setSubAddDialogError] = useState(true);

  const [subDialogEditOpen, setSubEditDialogOpen] = useState(false);
  const [subDialogEditValue, setSubEditDialogValue] = useState('');
  const [subDialogEditError, setSubEditDialogError] = useState(true);
  

  const toggleAddDialog = () => {
    setAddDialogOpen((prev) => !prev)
    setAddDialogValue('');
    setAddDialogError(true);
  }

  const toggleSubAddDialog = () => {
    setSubAddDialogOpen((prev) => !prev)
    setSubAddDialogValue('');
    setSubAddDialogError(true);
  }

  const toggleEditDialog = () => {
    setEditDialogOpen((prev) => !prev)
    setEditDialogValue('');
    setEditDialogError(true);
  }

  const toggleSubEditDialog = () => {
    setSubEditDialogOpen((prev) => !prev)
    setSubEditDialogValue('');
    setSubEditDialogError(true);
  }

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setAddDialogValue(event.target.value);
    if(3 <= event.target.value.length && event.target.value.length <= 20) {
      setAddDialogError(false);
    } else {
      setAddDialogError(true);
    }
  }

  const handleChangeSubName = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSubAddDialogValue(event.target.value);
    if(3 <= event.target.value.length && event.target.value.length <= 20) {
      setSubAddDialogError(false);
    } else {
      setSubAddDialogError(true);
    }
  }

  const handleEditName = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEditDialogValue(event.target.value);
    if(3 <= event.target.value.length && event.target.value.length <= 20) {
      setEditDialogError(false);
    } else {
      setEditDialogError(true);
    }
  }

  const handleEditSubName = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSubEditDialogValue(event.target.value);
    if(3 <= event.target.value.length && event.target.value.length <= 20) {
      setSubEditDialogError(false);
    } else {
      setSubEditDialogError(true);
    }
  }
  
  const handleAddCategory = () => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation CreateCategory {
      CreateCategory(input: {categoryid: "${dialogAddValue}"}) {categoryid}}`;
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
          alert('Category already exists or invalid input.');
        } else {
          setNewCategory(json.data.CreateCategory);
        }
      });
  }
    
  const handleDeleteCategory = (deleteCategory: string) => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation DeleteCategory {
      DeleteCategory(input: {
        categoryid: "${deleteCategory}"
      }) {
        categoryid
      }
    }`;
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
          alert('Category does not exist or invalid input.');
        } else {
          setNewCategory(json.data.CreateCategory);
        }
      });
  }

  const handleEditCategory = () => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation EditCategory {
      EditCategory(input: {
        categoryid: "${selectedCategory}",
        newid: "${dialogEditValue}",
      }) {
        categoryid
      }
    }`;
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
          alert('Category inputs are invalid. Check if category to edit exists or if new name is taken by existing category.');
        } else {
          setNewCategory(json.data.EditCategory);
        }
      });
  }

  const handleAddSubCategory = () => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation CreateSubCategory {
      CreateSubCategory(input: {
        categoryid: "${selectedCategory}", 
        subcategoryid: "${subDialogAddValue}"
      }) {categoryid}}`;
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
          alert('SubCategory already exists or invalid input.');
        } else {
          setNewSubCategory(json.data.CreateSubCategory);
        }
      });
  }

  const handleEditSubCategory = () => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation EditSubCategory {
      EditSubCategory(input: {
        subcategoryid: "${selectedSubCategory}",
        newid: "${subDialogEditValue}",
      }) {
        categoryid,
        subcategoryid,
      }
    }`;
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
          alert('SubCategory inputs are invalid.');
        } else {
          setNewSubCategory(json.data.EditSubCategory);
        }
      });
  }

  const handleDeleteSubCategory = (deleteSubCategory: string) => {
    const bearerToken = userCtx?.loginDetails?.accessToken;
    const query = `mutation DeleteSubCategory {
      DeleteSubCategory(input: {
        subcategoryid: "${deleteSubCategory}"
      }) {
        categoryid,
        subcategoryid,
      }
    }`;
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
          alert('SubCategory does not exist or invalid input.');
        } else {
          setNewSubCategory(json.data.DeleteSubCategory);
        }
      });
  }

  return (
    <>
      <Dialog aria-label="addDialog" open={dialogAddOpen} fullWidth maxWidth={'xs'}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Name"
            fullWidth
            variant="filled"
            value={dialogAddValue}
            error={dialogAddError}
            onChange={handleChangeName}
            inputProps={{'maxLength': 20, 'aria-label': 'Category Name Create'}}
            helperText={`${dialogAddValue.length}/20`}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleAddDialog}>Cancel</Button>
          <Button 
            aria-label='Add'
            onClick={() => {
              if (dialogAddError) {
                alert('Invalid input!');
              }
              else {
                handleAddCategory();
                toggleAddDialog();
              }
            }}
          >Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog aria-label="addSubDialog" open={subDialogAddOpen} fullWidth maxWidth={'xs'}>
        <DialogTitle>{`Add '${selectedCategory}' SubCategory`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="SubCategory Name"
            fullWidth
            variant="filled"
            value={subDialogAddValue}
            error={subDialogAddError}
            onChange={handleChangeSubName}
            inputProps={{'maxLength': 20, 'aria-label': 'SubCategory Name Create'}}
            helperText={`${subDialogAddValue.length}/20`}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleSubAddDialog}>Cancel</Button>
          <Button 
            aria-label='Add'
            onClick={() => {
              if (subDialogAddError) {
                alert('Invalid input!');
              }
              else {
                handleAddSubCategory();
                toggleSubAddDialog();
              }
            }}
          >Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog aria-label="editDialog" open={dialogEditOpen} fullWidth maxWidth={'xs'}>
        <DialogTitle>Edit &apos;{selectedCategory}&apos; Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Name"
            fullWidth
            variant="filled"
            value={dialogEditValue}
            error={dialogEditError}
            onChange={handleEditName}
            inputProps={{'maxLength': 20, 'aria-label': 'Category Name Edit'}}
            helperText={`${dialogEditValue.length}/20`}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleEditDialog}>Cancel</Button>
          <Button 
            aria-label='Edit'
            onClick={() => {
              if (dialogEditError) {
                alert('Invalid input!');
              }
              else {
                handleEditCategory();
                toggleEditDialog();
              }
            }}
          >Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog aria-label="editSubDialog" open={subDialogEditOpen} fullWidth maxWidth={'xs'}>
        <DialogTitle>Edit &apos;{selectedSubCategory}&apos; SubCategory</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="SubCategory Name"
            fullWidth
            variant="filled"
            value={subDialogEditValue}
            error={subDialogEditError}
            onChange={handleEditSubName}
            inputProps={{'maxLength': 20, 'aria-label': 'SubCategory Name Edit'}}
            helperText={`${subDialogEditValue.length}/20`}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleSubEditDialog}>Cancel</Button>
          <Button 
            aria-label='Edit'
            onClick={() => {
              if (subDialogEditError) {
                alert('Invalid input!');
              }
              else {
                handleEditSubCategory();
                toggleSubEditDialog();
              }
            }}
          >Submit</Button>
        </DialogActions>
      </Dialog>
      <Grid sx={{mt: 9, p: 2}}>
        <IconButton
          aria-label="Create Category"
          onClick={() => {toggleAddDialog()}}
          sx={{ my: 2, 
            width: 40,
            height: 40,
            marginLeft: 'auto',
            color: '#000',
            // display: 'block', 
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
          <AddIcon/>
        </IconButton>
        { categories
          .map((category) => (
            <Accordion 
              key={category.categoryid} 
              onChange={handleChange(`${category.categoryid}`)}
              onClick={() => {setCategory(category.categoryid)}}
              expanded={expanded === `${category.categoryid}`}
            >
              <AccordionSummary
                data-testid={`${category.categoryid}-Panel`}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"

              >
                <Typography sx={{pl: 2, pt: 2}} variant="h6">
                  {category.categoryid}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2} direction="row" sx={{marginLeft: "auto", mb: 2, pl: 2, pr: 1}}>
                  <IconButton
                    aria-label={`Add '${category.categoryid}' SubCategory`}
                    data-testid={`${category.categoryid}-AddSubCategory`}
                    onClick={() => {
                      toggleSubAddDialog();
                    }}
                    sx={{ 
                      width: 36,
                      height: 36,
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
                    <CreateNewFolderIcon/>
                  </IconButton>
                  <IconButton
                    data-testid={`${category.categoryid}-Edit`}
                    aria-label="Edit Category"
                    onClick={() => {
                      // handleEditCategory(category.categoryid, "Vehicles");
                      toggleEditDialog();
                    }}
                    sx={{ 
                      width: 36,
                      height: 36,
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
                    <EditIcon/>
                  </IconButton>
                  <IconButton
                    aria-label="Delete Category"
                    data-testid={`${category.categoryid}-Delete`}
                    onClick={() => {
                      handleDeleteCategory(category.categoryid);
                    }}
                    sx={{ 
                      width: 36,
                      height: 36,
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
                    <DeleteIcon/>
                  </IconButton>
                </Stack>
                <Divider/>
                {
                  subCategories
                    .map((subcategory) => (
                      <Grid key={subcategory.subcategoryid}
                        data-testid={`${subcategory.subcategoryid}-Panel`}
                        onClick={() => {setSubCategory(subcategory.subcategoryid)}}
                      >
                        <Typography sx={{pl: 2, my: 2}}>
                          {subcategory.subcategoryid}
                          <IconButton
                            data-testid={`${subcategory.subcategoryid}-Edit`}
                            aria-label={`Edit SubCategory ${subcategory.subcategoryid}`}
                            onClick={() => {
                              toggleSubEditDialog();
                            }}
                            sx={{ 
                              ml: 1,
                              width: 20,
                              height: 20,
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
                            <EditIcon/>
                          </IconButton>
                          <IconButton
                            data-testid={`${subcategory.subcategoryid}-Delete`}
                            aria-label={`Delete SubCategory ${subcategory.subcategoryid}`}
                            onClick={() => {
                              handleDeleteSubCategory(subcategory.subcategoryid);
                            }}
                            sx={{ 
                              ml: 1,
                              width: 20,
                              height: 20,
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
                            <DeleteIcon/>
                          </IconButton>
                        </Typography>
                      </Grid>

                    ))
                }
              </AccordionDetails> 
            </Accordion>
          ))
        }
      </Grid>
    </>
  );
}
