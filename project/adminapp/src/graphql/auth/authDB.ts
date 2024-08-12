import { UserSession } from './schema';

export async function dbLogin(email: string, password: string): Promise<UserSession>{
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3010/api/v0/auth/login', {
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
      .then((data: UserSession) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
} 