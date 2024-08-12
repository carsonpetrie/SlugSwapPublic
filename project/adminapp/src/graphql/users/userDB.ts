import {User, UserID} from './schema';

export async function dbGetUsers(): Promise<User[]> {
  return new Promise ((resolve) => {
    fetch('http://localhost:3012/api/v0/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
  })
}

// export async function dbGetUser(userid: string): Promise<UserData> {
//   return new Promise((resolve, reject) => {
//     fetch(`http://localhost:3012/api/v0/account?id=${userid}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           reject (new Error(`HTTP ${res.status} - ${res.statusText}`));
//         }
//         return res.json();
//       })
//       .then((data) => {
//         resolve(data);
//       })
//   })
// }

export async function dbEnableUser(userid: string): Promise<UserID> {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3012/api/v0/enable', {
      method: 'POST',
      body: JSON.stringify({"id": userid}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  })
}

export async function dbDisableUser(userid: string): Promise<UserID> {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3012/api/v0/disable', {
      method: 'POST',
      body: JSON.stringify({"id": userid}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  })
}