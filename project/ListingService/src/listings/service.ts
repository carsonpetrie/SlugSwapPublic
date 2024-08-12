import { Listing } from ".";
import { pool } from "../db";
import Filter from "bad-words";

export class ListingService {

  public async getListings(searchValue?: string, category?: string, subcategory?: string, attributes?:string): Promise<Listing[]> {
    return new Promise((resolve) => {
      let select = "SELECT * FROM Listings";
      let variables:string[] = [];
      // Search by title, category, subcategory, and attributes
      if(searchValue && category && subcategory && attributes) {
        const atts = JSON.parse(attributes);
        for (const i in atts) {
          if (Number(i) > 0 && Number(i) < atts.length) {
            select += ` AND (`
          }
          for (const j in atts[i].Contents) {
            if (Number(j) > 0 && Number(j) < atts[i].Contents.length) {
              select += ` OR attributes @> '`+JSON.stringify([{"name":atts[i].Name, "contents": atts[i].Contents[j]}])+`'`;
            } else if (Number(i) === 0 && Number(j) === 0) {
              select += ` WHERE (attributes @> '`+JSON.stringify([{"name":atts[i].Name, "contents": atts[i].Contents[j]}])+`'`;
            } else {
              select += ` attributes @> '`+JSON.stringify([{"name":atts[i].Name, "contents": atts[i].Contents[j]}])+`'`;
            }
          }
          select += `)`;
        } 
        select += " INTERSECT SELECT * FROM Listings";
        select += " WHERE data->>'title' ILIKE '%' || $1 || '%' AND categoryID = $2 AND subcategoryID = $3 AND data->>'pending' = 'false'"
        variables = [searchValue, category, subcategory]
      // Search by title, category, and subcategory
      } else if(searchValue && category && subcategory) {
        select += " WHERE data->>'title' ILIKE '%' || $1 || '%' AND categoryID = $2 AND subcategoryID = $3 AND data->>'pending' = 'false' ORDER BY data->>'dateCreated'"
        variables = [searchValue, category, subcategory]
      // Search by title and category
      } else if (searchValue && category) {
        select += " WHERE data->>'title' ILIKE '%' || $1 || '%' AND categoryID = $2 AND data->>'pending' = 'false' ORDER BY data->>'dateCreated'"
        variables = [searchValue, category]
      // Search by category and subcategory and attributes
      } else if (category && subcategory && attributes) {
        const atts = JSON.parse(attributes);
        for (const i in atts) {
          if (Number(i) > 0 && Number(i) < atts.length) {
            select += ` AND (`
          }
          for (const j in atts[i].Contents) {
            if (Number(j) > 0 && Number(j) < atts[i].Contents.length) {
              select += ` OR attributes @> '`+JSON.stringify([{"name":atts[i].Name, "contents": atts[i].Contents[j]}])+`'`;
            } else if (Number(i) === 0 && Number(j) === 0) {
              select += ` WHERE (attributes @> '`+JSON.stringify([{"name":atts[i].Name, "contents": atts[i].Contents[j]}])+`'`;
            } else {
              select += ` attributes @> '`+JSON.stringify([{"name":atts[i].Name, "contents": atts[i].Contents[j]}])+`'`;
            }
          }
          select += `)`;
        } 
        select += " INTERSECT SELECT * FROM Listings";
        select += " WHERE categoryID = $1 AND subcategoryID = $2 AND data->>'pending' = 'false'"
        variables = [category, subcategory]
      // Search by category and subcategory
      } else if (category && subcategory) {
        select += " WHERE categoryID = $1 AND subcategoryID = $2 AND data->>'pending' = 'false' ORDER BY data ->>'dateCreated'"
        variables = [category, subcategory]
      // Search by category only
      } else if (category) {
        select += " WHERE categoryID = $1 AND data->>'pending' = 'false' ORDER BY data ->>'dateCreated'"
        variables = [category]
      // Search by title only
      } else if (searchValue) {
        select += " WHERE data->>'title' ILIKE '%' || $1 || '%' AND data->>'pending' = 'false' ORDER BY data ->>'dateCreated'"
        variables = [searchValue]
      // Get all listings
      } else {
        select += " WHERE data->>'pending' = 'false' ORDER BY data->>'dateCreated' DESC LIMIT 25";
        variables = []
      }
      const query = {
        text: select,
        values: variables
      };
      pool.query(query)
        .then((res) => {
          resolve(res.rows);
        });
    })
  }

  public async getPostersListings(posterid?: string): Promise<Listing[]> {
    return new Promise((resolve) => {
      const select = "SELECT * FROM Listings WHERE posterID = $1 AND data->>'pending' = 'false' ORDER BY data->>'dateCreated'";
      const query = {
        text: select,
        values: [posterid]
      };
      pool.query(query)
        .then((res) => {
          resolve(res.rows);
        });
    })
  }

  public async createListing(id: string, categoryid: string, subcategoryid:string, title: string, description: string, price: number, imgs: string[]): Promise<Listing> {
    return new Promise((resolve) => {
      const insert =
      'INSERT INTO Listings (posterID, categoryID, subcategoryID, data) ' +
      `SELECT $1, $2, $3, $4::jsonb || jsonb_build_object('dateCreated', now()) ` +
      `RETURNING listingID, posterID, categoryid, data`;
      const filter = new Filter();
      let pending = 'false';
      if (filter.isProfane(title) || filter.isProfane(title)) {
        pending = 'true';
      }
      const query = {
        text: insert,
        values: [id, categoryid, subcategoryid, {title, description, price, imgs, pending}],
      };
      pool.query(query)
        .then((res) => {
          resolve(res.rows[0]);
        });
    })
  }

  public async getListing(listingID: string): Promise<Listing> {
    return new Promise((resolve, reject) => {
      const select = 
      `SELECT * ` +
      `FROM Listings ` +
      `WHERE Listings.listingID = $1 `;
      const query = {
        text: select,
        values: [listingID],
      };
      pool.query(query)
        .then((res) => {
          res.rows.length==1 ? resolve(res.rows[0]) : reject(new Error('GetListing Error'));
        });
    })
  }

  public async deleteListing(listingID: string, userID: string, roles: string[]): Promise<Listing> {
    const listing = await this.getListing(listingID);
    console.log(listing.posterid, userID);
    return new Promise((resolve, reject) => {
      console.log(roles);
      if ((listing.posterid != userID) && (!roles.includes("moderator") && !roles.includes("admin"))) {
        reject(new Error('Unauthorized Or Not Found'));
      } else {
        const select = 
        `DELETE FROM Listings WHERE Listings.listingID = $1 RETURNING Listings.listingID`;
        const query = {
          text: select,
          values: [listingID],
        };
        pool.query(query)
          .then((res) => {
            resolve(res.rows[0]);
          });
      }
    })
  }

  public async getPendingListings(): Promise<Listing[]> {
    return new Promise((resolve) => {
      const select = "SELECT * FROM Listings WHERE data->>'pending' = 'true'";
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

  public async approvePendingListing(listingID: string): Promise<Listing> {
    return new Promise((resolve, reject) => {
      const update = 
      `UPDATE Listings SET data = jsonb_set(data, '{pending}', 'false'::jsonb) WHERE listingID = $1 RETURNING *`;
      const query = {
        text: update,
        values: [listingID],
      };
      pool.query(query)
        .then((res) => {
          res.rows.length == 1 ? resolve(res.rows[0]) : reject(new Error('Listing Not Found'));
        });
    })
  }

  public async flagListing(listingID: string): Promise<Listing> {
    return new Promise((resolve, reject) => {
      const update = 
      `UPDATE Listings SET data = jsonb_set(data, '{pending}', 'true'::jsonb) WHERE listingID = $1 RETURNING *`;
      const query = {
        text: update,
        values: [listingID],
      };
      pool.query(query)
        .then((res) => {
          res.rows.length == 1 ? resolve(res.rows[0]) : reject(new Error('Listing Not Found'));
        });
    })
  }
}