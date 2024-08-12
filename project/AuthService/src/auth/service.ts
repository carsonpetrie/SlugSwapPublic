import * as jwt from "jsonwebtoken";

import { env } from '../env';
import { SessionUser, Account, Credentials, User, AuthCheck } from './types';
import { dbAuth } from './db';


export class AuthService {

  public async login(credentials: Credentials): Promise<User>  {
    return new Promise((resolve, reject) => {
      dbAuth(credentials).then((user: Account) => {
        const accessToken = jwt.sign(
          {userid: user.userid, name: user.name, roles: user.roles},
          env.JWT_SECRET_KEY, {
            expiresIn: '30m',
            algorithm: 'HS256',
          });
        resolve({name: user.name, accessToken: accessToken, userid: user.userid, roles: user.roles});
        return;
      }, (error: Error) => {
        reject(error);
      })
    });
  }

  public async check(input: AuthCheck): Promise<SessionUser>  {
    const {encryptedToken, roles } = input;
    return new Promise((resolve, reject) => {
      jwt.verify(encryptedToken, env.JWT_SECRET_KEY, (err: jwt.VerifyErrors|null, decoded?: jwt.JwtPayload|string) => {
        if (err || typeof decoded === 'undefined') {
          reject(err);
        } else if (roles) {
          if (typeof decoded === 'string') {
            reject(new Error("Unauthorised"));
          } else {
            for (const role of roles) { // only time decoded is und is on error
              if (!decoded.roles || !decoded.roles.includes(role)) {
                reject(new Error("Unauthorised"));
              }
            }
            resolve({userid: decoded.userid, name: decoded.name, roles: decoded.roles});
          }
        }
      });
    });
  }
}
