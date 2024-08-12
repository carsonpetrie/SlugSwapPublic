import { Attributes } from '.';
import { pool } from '../db';

export class AttributeService {
  public async getAttributes(subcategoryid: string): Promise<Attributes> {
    const select = `SELECT attributes FROM SubCategories WHERE subcategoryID = $1`
    const query = {
      text: select,
      values: [subcategoryid],
    };
    const {rows} = await pool.query(query);
    const att = {'attributes': JSON.stringify(rows[0].attributes)}
    return (att);
  }
}