import { Credentials, UserSession } from "./schema";
import { SessionUser } from "../../types/custom";
import { dbLogin } from "./authDB";

export class AuthService {

  public async login(credentials: Credentials): Promise<UserSession>  {
    const { email, password } = credentials;
    return dbLogin(email, password);
  }

  public async check(authHeader: string | null, roles?: string[]): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if(authHeader) {
        const token = authHeader.split(' ')[1];
        fetch('http://localhost:3010/api/v0/auth/check', {
          method: 'POST',
          body: JSON.stringify({
            encryptedToken: token,
            roles: roles,
          }),
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
            reject(error);
          })
      } else {
        reject(new Error('Unauthorized!'));
      }
      
    })
  }
}