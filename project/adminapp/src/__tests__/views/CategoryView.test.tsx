import { UserSession } from '@/graphql/auth/schema';
import CategoryView from '../../views/CategoryView';
import { UserContext } from '../../views/context';
import { 
  render, 
  screen, 
  fireEvent, 
  waitForElementToBeRemoved, 
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

let single = false;

const handlers = [
  graphql.query('GetCategories', async (req, res, ctx) => {
    if(!single) {
      return res(
        ctx.data({
          GetCategories: [
            {
              "categoryid": "Vehicles"
            },
            {
              "categoryid": "Furniture"
            },
            {
              "categoryid": "Clothes"
            },
          ]
        }),
      )
    } else {
      return res(
        ctx.data({
          GetCategories: [
            {
              "categoryid": "Vehicles"
            }
          ]
        }),
      )
    }
  }),
  graphql.mutation('CreateCategory', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer invalid') {
      return res(
        ctx.errors ([ {
          "message": "Category already exists."
        }]),
      );
    } else {
      return res(
        ctx.data({
          CreateCategory: {
            categoryid: 'Test',
          }
        }),
      )
    }
  }),
  graphql.mutation('DeleteCategory', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer invalid') {
      return res(
        ctx.errors ([ {
          "message": "Category does not exist."
        }]),
      );
    } else {
      return res(
        ctx.data({
          DeleteCategory: {
            categoryid: 'Test',
          }
        }),
      )
    }
  }),
  graphql.mutation('EditCategory', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer invalid') {
      return res(
        ctx.errors ([ {
          "message": "Category inputs are invalid. Check if category to edit exists or if new name is taken by existing category."
        }]),
      );
    } else {
      return res(
        ctx.data({
          EditCategory: {
            categoryid: 'Test',
          }
        }),
      )
    }
  }),
  graphql.query('GetSubCategories', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetSubCategories: [
          {
            "subcategoryid": "Cars"
          },
          {
            "subcategoryid": "Boats"
          },
          {
            "subcategoryid": "Buses"
          },
        ]
      }),
    )
  }),
  graphql.mutation('CreateSubCategory', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer invalid') {
      return res(
        ctx.errors ([ {
          "message": "SubCategory already exists."
        }]),
      );
    } else {
      return res(
        ctx.data({
          CreateSubCategory: {
            subcategoryid: 'Test',
          }
        }),
      )
    }
  }),
  graphql.mutation('DeleteSubCategory', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer invalid') {
      return res(
        ctx.errors ([ {
          "message": "SubCategory does not exist."
        }]),
      );
    } else {
      return res(
        ctx.data({
          DeleteCategory: {
            subcategoryid: 'Test',
          }
        }),
      )
    }
  }),
  graphql.mutation('EditSubCategory', async (req, res, ctx) => {
    if(req.headers.get('authorization') == 'Bearer invalid') {
      return res(
        ctx.errors ([ {
          "message": "Error"
        }]),
      );
    } else {
      return res(
        ctx.data({
          EditSubCategory: {
            categoryid: 'Test',
            subcategoryid: 'TestSub'
          }
        }),
      )
    }
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => {
  window.history.pushState(null, document.title, 'http:localhost:3001/');
  server.resetHandlers()
})
afterAll(() => server.close())

const renderViewCategory = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <CategoryView/>
    </UserContext.Provider>
  );
};

const renderViewInvalidToken = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"invalid", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <CategoryView/>
    </UserContext.Provider>
  );
};

test('Open and Close Create Category Dialog', async () => {
  renderViewCategory();
  const createButton = await screen.findByLabelText('Create Category');
  fireEvent.click(createButton);
  const cancelButton = await screen.findByText('Cancel');
  fireEvent.click(cancelButton);
  waitForElementToBeRemoved(cancelButton);
})

test('Open and Close Edit Category Dialog', async () => {
  renderViewCategory();
  const editButton = await screen.findByTestId('Vehicles-Edit');
  fireEvent.click(editButton);
  const cancelButton = await screen.findByText('Cancel');
  fireEvent.click(cancelButton);
  waitForElementToBeRemoved(cancelButton);
})

test('Click and Close Accordion', async () => {
  renderViewCategory();
  const panel = await screen.findByTestId('Vehicles-Panel');
  fireEvent.click(panel);
  fireEvent.click(panel);
})

test('Create Category - Invalid Input', async () => {
  renderViewCategory();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const createButton = await screen.findByLabelText('Create Category');
  await waitFor(() => {
    fireEvent.click(createButton);
    screen.findByLabelText('Category Name Create');
  })
  const addButton = await screen.findByText('Add');
  fireEvent.click(addButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('Create Category - OK', async () => {
  renderViewCategory();
  const createButton = await screen.findByLabelText('Create Category');
  await waitFor(() => {
    fireEvent.click(createButton);
    screen.findByLabelText('Category Name Create');
  })
  const dialogTextField = await screen.findByLabelText('Category Name Create');
  await userEvent.type(dialogTextField, 'Test');
  const addButton = await screen.findByText('Add');
  fireEvent.click(addButton);
})

test('Create Category - Dupe', async () => {
  renderViewInvalidToken();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const createButton = await screen.findByLabelText('Create Category');
  fireEvent.click(createButton);
  const dialogTextField = await screen.findByLabelText('Category Name Create');
  await userEvent.type(dialogTextField, 'Test');
  const addButton = await screen.findByText('Add');
  fireEvent.click(addButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('Delete Category - OK', async () => {
  renderViewCategory();
  const deleteButton = await screen.findByTestId('Vehicles-Delete');
  fireEvent.click(deleteButton);
})

test('Delete Category - Invalid Login', async () => {
  renderViewInvalidToken();
  const deleteButton = await screen.findByTestId('Vehicles-Delete');
  fireEvent.click(deleteButton);
})

test('Edit Category - OK', async () => {
  renderViewCategory();
  const editButton = await screen.findByTestId('Vehicles-Edit');
  await waitFor(() => {
    fireEvent.click(editButton);
    screen.findByLabelText('Category Name Edit');
  })
  const dialogTextField = await screen.findByLabelText('Category Name Edit');
  await userEvent.type(dialogTextField, 'Test');
  const submitButton = await screen.findByText('Submit');
  fireEvent.click(submitButton);
})

test('Edit Category - Invalid Input', async () => {
  renderViewCategory();
  const editButton = await screen.findByTestId('Vehicles-Edit');
  await waitFor(() => {
    fireEvent.click(editButton);
    screen.findByLabelText('Category Name Edit');
  })
  const dialogTextField = await screen.findByLabelText('Category Name Edit');
  await userEvent.type(dialogTextField, 'c');
  const submitButton = await screen.findByText('Submit');
  fireEvent.click(submitButton);
})

test('Edit Category - Invalid Login', async () => {
  renderViewInvalidToken();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const editButton = await screen.findByTestId('Vehicles-Edit');
  await waitFor(() => {
    fireEvent.click(editButton);
    screen.findByLabelText('Category Name Edit');
  })
  const dialogTextField = await screen.findByLabelText('Category Name Edit');
  await userEvent.type(dialogTextField, 'Test');
  const submitButton = await screen.findByText('Submit');
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('CREATE SubCategory - OK', async () => {
  renderViewCategory();
  const panel = await screen.findByTestId('Vehicles-Panel');
  await waitFor(() => {
    fireEvent.click(panel);
  })
  const createButton = await screen.findByLabelText(`Add 'Vehicles' SubCategory`);
  await waitFor(() => {
    fireEvent.click(createButton);
    screen.findByLabelText('SubCategory Name Create');
  })
  const dialogTextField = await screen.findByLabelText('SubCategory Name Create');
  await userEvent.type(dialogTextField, 'Test');
  const addButton = await screen.findByText('Add');
  fireEvent.click(addButton);
})

test('CREATE SubCategory - Invalid Login', async () => {
  renderViewInvalidToken();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const panel = await screen.findByTestId('Vehicles-Panel');
  await waitFor(() => {
    fireEvent.click(panel);
  })
  const createButton = await screen.findByLabelText(`Add 'Vehicles' SubCategory`);
  await waitFor(() => {
    fireEvent.click(createButton);
    screen.findByLabelText('SubCategory Name Create');
  })
  const dialogTextField = await screen.findByLabelText('SubCategory Name Create');
  await userEvent.type(dialogTextField, 'Test');
  const addButton = await screen.findByText('Add');
  fireEvent.click(addButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('CREATE SubCategory - Invalid Input', async () => {
  renderViewCategory();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const panel = await screen.findByTestId('Vehicles-Panel');
  await waitFor(() => {
    fireEvent.click(panel);
  })
  const createButton = await screen.findByLabelText(`Add 'Vehicles' SubCategory`);
  await waitFor(() => {
    fireEvent.click(createButton);
    screen.findByLabelText('SubCategory Name Create');
  })
  const dialogTextField = await screen.findByLabelText('SubCategory Name Create');
  await userEvent.type(dialogTextField, 'A');
  const addButton = await screen.findByText('Add');
  fireEvent.click(addButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('Delete SubCategory - OK', async () => {
  single = true;
  renderViewCategory();
  const panel = await screen.findByTestId('Vehicles-Panel');
  await waitFor(() => {
    fireEvent.click(panel);
  })
  const deleteButton = await screen.findByTestId('Cars-Delete');
  await waitFor(() => {
    fireEvent.click(deleteButton);
  })
})

test('Delete SubCategory - Invalid Login', async () => {
  single = true;
  renderViewInvalidToken();
  const panel = await screen.findByTestId('Vehicles-Panel');
  await waitFor(() => {
    fireEvent.click(panel);
  })
  const deleteButton = await screen.findByTestId('Cars-Delete');
  await waitFor(() => {
    fireEvent.click(deleteButton);
  })
})

test('Edit SubCategory - OK', async () => {
  single = true;
  renderViewCategory();
  const editButton = await screen.findByTestId('Cars-Edit');
  await waitFor(() => {
    fireEvent.click(editButton);
    screen.findByLabelText('SubCategory Name Edit');
  })
  const dialogTextField = await screen.findByLabelText('SubCategory Name Edit');
  await userEvent.type(dialogTextField, 'Test');
  const submitButton = await screen.findByText('Submit');
  fireEvent.click(submitButton);
})

test('Edit SubCategory - Invalid Input', async () => {
  single = true;
  renderViewCategory();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const editButton = await screen.findByTestId('Cars-Edit');
  await waitFor(() => {
    fireEvent.click(editButton);
    screen.findByLabelText('SubCategory Name Edit');
  })
  const dialogTextField = await screen.findByLabelText('SubCategory Name Edit');
  await userEvent.type(dialogTextField, 'A');
  const submitButton = await screen.findByText('Submit');
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})

test('Edit SubCategory - Invalid Login', async () => {
  single = true;
  renderViewInvalidToken();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const editButton = await screen.findByTestId('Cars-Edit');
  await waitFor(() => {
    fireEvent.click(editButton);
    screen.findByLabelText('SubCategory Name Edit');
  })
  const dialogTextField = await screen.findByLabelText('SubCategory Name Edit');
  await userEvent.type(dialogTextField, 'Test');
  const submitButton = await screen.findByText('Submit');
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
})