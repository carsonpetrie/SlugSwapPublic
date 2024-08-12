import { Category } from '.';
import { pool } from '../db';

export class CategoryService {
  public async getAll(): Promise<Category[]> {
    const select = 
      `SELECT * FROM Categories `;
    const query = {
      text: select,
      values: [],
    };
    const {rows} = await pool.query(query);
    return rows;
  }

  // public async get(category_id: string): Promise<Category|undefined> {
  //   const select = 
  //     `SELECT * FROM Categories WHERE categoryID=$1`;
  //   const query = {
  //     text: select,
  //     values: [category_id],
  //   };
  //   const {rows} = await pool.query(query);

  //   return rows.length > 0 ? rows[0] : undefined;
  // }

  public async create(category_id: string): Promise<Category|undefined> {
    const insert =
      `INSERT INTO Categories (categoryID) ` +
      `SELECT $1::VARCHAR ` +
      `WHERE NOT EXISTS (SELECT categoryID FROM Categories WHERE categoryID=$1) ` +
      `RETURNING categoryID, data`;
    const query = {
      text: insert,
      values: [category_id],
    };
    const {rows} = await pool.query(query);
    return rows.length==1 ? rows[0] : undefined;
  }

  public async delete(category_id: string): Promise<Category|undefined> {

    const deleteCategory =
      `DELETE FROM Categories WHERE categoryID=$1 ` +
      `RETURNING categoryID, data`;
    const query = {
      text: deleteCategory,
      values: [category_id],
    };
    const {rows} = await pool.query(query);
    return rows.length==1 ? rows[0] : undefined;
  }

  public async edit(category_id: string, new_id: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      const update = 'UPDATE Categories SET categoryID = $1 WHERE categoryID = $2 RETURNING categoryID';
      const query = {
        text: update,
        values: [new_id, category_id],
      };
      pool.query(query)
        .then((res) => {
          if(res.rows.length == 1) {
            resolve(res.rows[0]);
          } else {
            reject(new Error('Category does not exist or invalid input.'))
          }
        });
    })
  }
}