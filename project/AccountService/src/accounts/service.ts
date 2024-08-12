import { Account, Credentials } from '.';
import { pool } from '../db';

export class AccountService {
  public async authenticateAccount(creds: Credentials): Promise<Account> {
    const { email, password } = creds;
    return new Promise((resolve, reject) => {
      const select = 
      `SELECT userID, data->>'name' as name, data->>'roles' as roles ` +
      `FROM Users WHERE email = $1 AND password = crypt($2, password) AND data->>'suspended' = 'false'`;
      const query = {
        text: select,
        values: [email, password],
      };
      pool.query(query)
        .then(res => {
          console.log(res.rows);
          if(res.rows.length === 1) {
            // bug in node-postgres causing arrays that are taken out directly to not be parsed
            res.rows[0].roles = JSON.parse(res.rows[0].roles);
            resolve(res.rows[0]) 
          }
          else {
            reject(new Error('Not Found'));
          }
        })
      return;
    })
  }

  public async createAccount(email: string, password: string, name: string): Promise<Account|undefined> {
    return new Promise((resolve, reject) => {
      const insert =
      'INSERT INTO Users (email, password, data) ' +
      `SELECT $1, crypt($2, gen_salt('bf')), $3 ` +
      `WHERE $1 NOT IN (SELECT email FROM Users) ` +
      `RETURNING userid, email, data`;
      const query = {
        text: insert,
        values: [email, password, {name: name, roles: ["member"], timestamp: Date.now(), description: "User has not set a description.", suspended: false}],
      };
      pool.query(query)
        .then((res) => {
          res.rows.length==1 ? resolve(res.rows[0]) : reject(new Error('User with that email already exists'));
        });
    })
  }

  public async getAccounts(): Promise<Account[]> {
    return new Promise ((resolve) => {
      const select =
      `SELECT userid, email, data ` +
      `FROM Users`;
      const query = {
        text: select,
        values: []
      };
      pool.query(query)
        .then((res) => {
          resolve(res.rows);
        });
    })
  }

  public async getAccount(id: string): Promise<Account> {
    return new Promise((resolve, reject) => {
      const select = 'SELECT userid, email, data FROM Users WHERE userID = $1';
      const query = {
        text: select,
        values: [id],
      };
      pool.query(query)
        .then((res) => {
          res.rows.length===1 ? resolve(res.rows[0].data) : reject(new Error('No user with that ID exists'));
        });
    })
  }

  public async editAccount(id: string, description: string): Promise<Account> {
    return new Promise((resolve, reject) => {
      const select = 'SELECT data FROM Users WHERE userID = $1';
      const query = {
        text: select,
        values: [id],
      };
      pool.query(query)
        .then((res) => {
          if (res.rows.length!=1) {
            reject (new Error('User With ID Does Not Exist'))
          }
          else {
            const data = res.rows[0].data
            data.description = description
            const update = 'UPDATE Users SET data = $1 WHERE userID = $2';
            const query = {
              text: update,
              values: [data, id],
            };
            pool.query(query)
              .then(() => {
                resolve(data)
              });
          }
        });
    })
  }

  public async deleteAccount(id: string): Promise<Account|undefined> {
    return new Promise((resolve, reject) => {      
      const insert =
      'DELETE FROM Users WHERE userID = $1 RETURNING userid, email, data';
      const query = {
        text: insert,
        values: [id],
      };
      pool.query(query)
        .then((res) => {
          res.rows.length==1 ? resolve(res.rows[0]) : reject(new Error('User with that email does not exist'));
        });
    })
  }

  public async enableAccount(userid: string): Promise<string|undefined> {
    const update = 
    `UPDATE Users SET data = jsonb_set(data, '{suspended}', 'false'::jsonb) WHERE userID = $1 RETURNING userid`;
    const query = {
      text: update,
      values: [userid],
    };
    const {rows} = await pool.query(query)
    return rows.length === 1 ? rows[0] : undefined
  }

  public async disableAccount(userid: string): Promise<string|undefined> {
    const update = 
    `UPDATE Users SET data = jsonb_set(data, '{suspended}', 'true'::jsonb) WHERE userID = $1 RETURNING userid`;
    const query = {
      text: update,
      values: [userid],
    };
    const {rows} = await pool.query(query)
    return rows.length === 1 ? rows[0] : undefined
  }
}