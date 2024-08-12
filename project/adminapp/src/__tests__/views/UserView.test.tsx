import { UserSession } from '@/graphql/auth/schema';
import UserView from '../../views/UserView';
import { UserContext } from '../../views/context';
import { 
  render, 
  screen, 
  fireEvent, 
  waitFor,
} from '@testing-library/react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

// let succeed = true;

const handlers = [
  graphql.query('GetUsers', async (req, res, ctx) => {
    return res(
      ctx.data({
        GetUsers: [
          {
            "userid": "0874daf0-5b0d-4c91-be85-1b88acd226d6",
            "data": {
              "name": "Molly Member",
              "avatar": "https://i.imgur.com/a5GQflf.png",
              "roles": [
                "member"
              ],
            }
          },
          {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d",
            "data": {
              "name": "Anna Admin",
              "avatar": "https://i.imgur.com/sWFKQnd.jpeg",
              "roles": [
                "member",
                "admin"
              ],
            }
          },
          {
            "userid": "bb123912-09b9-4e25-9c9e-93ad397eee9d",
            "data": {
              "name": "Sally Suspension",
              "avatar": "https://i.imgur.com/Bf9d8QM.jpeg",
              "roles": [
                "member"
              ],
            }
          },
        ]
      }),
    )
  }),
  graphql.mutation('EnableUser', async (req, res, ctx) => {
    if(req.headers.get('authorization') != 'Bearer invalid') {
      return res(
        ctx.data({
          enableUser: {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d"
          }
        })
      )
    } else {
      return res(
        ctx.errors ([ {
          "message": "Invalid user."
        }]),
      )
    }
  }),
  graphql.mutation('disableUser', async (req, res, ctx) => {
    if(req.headers.get('authorization') != 'Bearer invalid') {
      return res(
        ctx.data({
          disableUser: {
            "userid": "aa327113-09b9-4e25-9c9e-93ad397eee9d"
          }
        })
      )
    } else {
      return res(
        ctx.errors ([ {
          "message": "Invalid user."
        }]),
      )
    }
  }),
]

const server = setupServer(...handlers);

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers();
})
afterAll(() => server.close())

const renderViewUsers = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"whatever", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <UserView/>
    </UserContext.Provider>
  );
};

const renderViewInvalidToken = () => {
  render (
    <UserContext.Provider value={{
      loginDetails: {name:"Anna Admin",accessToken:"invalid", userid:"ANNASUUID", roles:["member", "admin"]}, setLoginDetails: (_session: UserSession|undefined) => {return;},
    }}>
      <UserView/>
    </UserContext.Provider>
  );
};

test('Renders Users - Enable', async () => {
  renderViewUsers();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const blockButton = await screen.findByLabelText(`Enable '0874daf0-5b0d-4c91-be85-1b88acd226d6'`);
  await waitFor(() => {
    fireEvent.click(blockButton);
  })
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
});

test('Renders Users - Enable Invalid', async () => {
  renderViewInvalidToken();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const blockButton = await screen.findByLabelText(`Enable '0874daf0-5b0d-4c91-be85-1b88acd226d6'`);
  await waitFor(() => {
    fireEvent.click(blockButton);
  })
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
});

test('Renders Users - Disable', async () => {
  renderViewUsers();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const unbanButton = await screen.findByLabelText(`Disable '0874daf0-5b0d-4c91-be85-1b88acd226d6'`);
  await waitFor(() => {
    fireEvent.click(unbanButton);
  })
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
});

test('Renders Users - Disable Invalid', async () => {
  renderViewInvalidToken();
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const unbanButton = await screen.findByLabelText(`Disable '0874daf0-5b0d-4c91-be85-1b88acd226d6'`);
  await waitFor(() => {
    fireEvent.click(unbanButton);
  })
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
});