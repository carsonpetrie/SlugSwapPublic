import {User, UserData, UserDataInput} from './schema';

export async function dbCreateUser(email: string, password: string, name: string): Promise<User> {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3012/api/v0/account/create', {
      method: 'POST',
      body: JSON.stringify({"email": email, "password": password, "name": name}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          reject (new Error(`HTTP ${res.status} - ${res.statusText}`));
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
  })
}

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

export async function dbGetUser(userid: string): Promise<UserData> {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3012/api/v0/account?id=${userid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          reject (new Error(`HTTP ${res.status} - ${res.statusText}`));
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
  })
}

export async function dbEditUserData(input: UserDataInput, userid: string): Promise<UserData> {
  return new Promise((resolve, reject) => {
    if (input.userid === userid) {
      fetch('http://localhost:3012/api/v0/account/edit', {
        method: 'POST',
        body: JSON.stringify({"id": input.userid, "description": input.description}),
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
    } else {
      reject(new Error('Unauthorised to edit user data'))
    }
  })
}

export async function dbDeleteUser(userid: string, currid: string): Promise<User> {
  return new Promise((resolve, reject) => {

    if(userid == currid) throw new Error('You cannot delete yourself');

    fetch('http://localhost:3012/api/v0/account/delete', {
      method: 'POST',
      body: JSON.stringify({"id": userid}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          reject (new Error(`HTTP ${res.status} - ${res.statusText}`));
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
  })
}
