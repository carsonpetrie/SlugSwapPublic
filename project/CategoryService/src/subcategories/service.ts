import {SubCategory } from '.';
import { pool } from '../db';

export class SubCategoryService {
  public async getAll(categoryid: string): Promise<SubCategory[]> {
    const select = 
      `SELECT * FROM SubCategories WHERE categoryID = $1`;
    const query = {
      text: select,
      values: [categoryid],
    };
    const {rows} = await pool.query(query);
    return rows;
  }

  public async create(subcategory_id: string, category_id: string): Promise<SubCategory|undefined> {
    const insert =
      `INSERT INTO SubCategories (subcategoryID, categoryID) ` +
      `VALUES ($1, $2)` +
      `RETURNING subcategoryID, categoryID`;
    const query = {
      text: insert,
      values: [subcategory_id, category_id],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async delete(subcategory_id: string): Promise<SubCategory|undefined> {

    const deleteCategory =
      `DELETE FROM SubCategories WHERE subcategoryID=$1 ` +
      `RETURNING categoryID, subcategoryID, attributes`;
    const query = {
      text: deleteCategory,
      values: [subcategory_id],
    };
    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async edit(category_id: string, new_id: string): Promise<SubCategory> {
    return new Promise((resolve, reject) => {
      const update = 'UPDATE SubCategories SET subcategoryID = $1 WHERE subcategoryID = $2 RETURNING categoryID, subcategoryID, attributes';
      const query = {
        text: update,
        values: [new_id, category_id],
      };
      pool.query(query)
        .then((res) => {
          if(res.rows.length == 1) {
            resolve(res.rows[0]);
          } else {
            reject(new Error('SubCategory does not exist or invalid input.'))
          }
        });
    })
  }
}