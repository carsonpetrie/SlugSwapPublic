import {Account, Credentials} from './types';

export async function dbAuth(credentials: Credentials): Promise<Account> {
  const {email, password} = credentials;
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3012/api/v0/account/authenticate', {
      method: 'POST',
      body: JSON.stringify({"email": email, "password": password}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      })
  })
}