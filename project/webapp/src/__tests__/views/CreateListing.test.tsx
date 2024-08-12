import CreateListing from '../../views/Listings/CreateListing';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';
import { FileWithPreview } from '@/views/FileDropper';

window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();
jest.mock('next/router', ()=> ({push: jest.fn()}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

jest.setTimeout(15000);

const handlers = [
  graphql.mutation('CreateListing', async (req, res, ctx) => {
    if(req.headers.get('authorization') === 'Bearer ERROR') {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      );
    } else {
      return res(
        ctx.data({
          CreateListing: {
            listingid:'123',
          }
        }),
      )
    }
  }),
  graphql.query('GetCategories', async (req, res, ctx) => {
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
          }
        ]
      }),
    )
  }),
  graphql.query('GetSubCategories', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetSubCategories: [
          {
            "subcategoryid": "Cars & Trucks",
          },
          {
            "subcategoryid": "Motorcycles",
          },
          {
            "subcategoryid": "Campers & RVs",
          }
        ]
      }),
    )
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('RENDER', async () => {
  render(
    <CreateListing/>
  )
})

test('CreateListing Success', async () => {
  localStorage.setItem('user', JSON.stringify({"name":"Anna","accessToken":"whatever"}));
  const user = userEvent.setup()
  render(
    <CreateListing/>
  )
  fireEvent.click(screen.getByRole('button', {
    name: 'cl.new',
  }));
  await screen.findByText('cl.create');
  const title = screen.getByLabelText('Title');
  await user.type(title, 'Test');
  const description = screen.getByLabelText('Description');
  await user.type(description, 'description');
  const price = screen.getByLabelText('Price');
  await user.type(price, '0.99');
  fireEvent.mouseDown(screen.getByRole('button',
    {name:"cl.select-cat ​"}
  ));
  fireEvent.click(screen.getByRole('option', {
    name: 'Vehicles'
  }));
  await new Promise((r) => setTimeout(r, 2000));
  await screen.findByText('Vehicles');
  fireEvent.mouseDown(screen.getByRole('button',
    {name:"cl.select-subcat ​"}
  ));
  fireEvent.click(screen.getByRole('option', {
    name: 'Cars & Trucks'
  }));
  await act(() => {
    fireEvent.drop(screen.getByLabelText("dropzone"), createDtWithFiles([{ path: "poop.PNG", preview: "http://localhost:3000/afsdfsafdsa", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview]));
  });
  await act(() => {
    fireEvent.drop(screen.getByLabelText("dropzone"), createDtWithFiles([{ path: "poop.PNG", preview: "http://localhost:3000/5454", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview]));
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'cl.post',
  }));
})

test('CreateListing With Invalid inputs', async () => {
  localStorage.setItem('user', JSON.stringify({"name":"Anna","accessToken":"whatever"}));
  render(
    <CreateListing/>
  )
  fireEvent.click(screen.getByRole('button', {
    name: 'cl.new',
  }));
  await screen.findByText('cl.create');
  const title = screen.getByLabelText('Title');
  await userEvent.type(title, 'Test');
  await userEvent.clear(title);
  const description = screen.getByLabelText('Description');
  await userEvent.type(description, 'description');
  const price = screen.getByLabelText('Price');
  await userEvent.type(price, '0.99');
  await userEvent.clear(price);
  fireEvent.click(screen.getByRole('button', {
    name: 'cl.post',
  }));
})

test('CreateListing with invalid creds', async () => {
  localStorage.setItem('user', JSON.stringify({"name":"Anna","accessToken":"ERROR"}));
  let alerted = false;
  window.alert = () => {
    alerted = true
  };
  render(
    <CreateListing/>
  )
  fireEvent.click(screen.getByRole('button', {
    name: 'cl.new',
  }));
  await screen.findByText('cl.create');
  const title = screen.getByLabelText('Title');
  await userEvent.type(title, 'Test');
  const description = screen.getByLabelText('Description');
  await userEvent.type(description, 'description');
  const price = screen.getByLabelText('Price');
  await userEvent.type(price, '0.99');
  fireEvent.mouseDown(screen.getByRole('button',
    {name:"cl.select-cat ​"}
  ));
  fireEvent.click(screen.getByRole('option', {
    name: 'Vehicles'
  }));
  await new Promise((r) => setTimeout(r, 2000));
  await screen.findByText('Vehicles');
  fireEvent.mouseDown(screen.getByRole('button',
    {name:"cl.select-subcat ​"}
  ));
  fireEvent.click(screen.getByRole('option', {
    name: 'Cars & Trucks'
  }));
  fireEvent.click(screen.getByRole('button', {
    name: 'cl.post',
  }));
  await waitFor(() => {
    expect(alerted).toBe(true)
  });
})

function createDtWithFiles(files = [] as File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: "file",
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
}
