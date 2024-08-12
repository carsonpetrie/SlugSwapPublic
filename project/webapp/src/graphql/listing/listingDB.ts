import {Listing} from './schema';
import 'whatwg-fetch';

export async function dbGetListings(searchValue?: string, category?: string, subcategory?: string, attributes?:string): Promise<Listing[]> {
  return new Promise((resolve) => {
    const query = `http://localhost:3014/api/v0/listing/get`;
    fetch(query, {
      method: 'POST',
      body: JSON.stringify({
        "searchValue": searchValue, 
        "category": category, 
        "subcategory": subcategory,
        "attributes": attributes,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data: Listing[]) => {
        resolve(data);
      })
  })
}

export async function dbGetListingsByPoster(posterid?: string): Promise<Listing[]> {
  return new Promise((resolve) => {
    let query = `http://localhost:3014/api/v0/listing/poster`;
    if (posterid) { query += `?posterid=${posterid}` }
    fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data: Listing[]) => {
        resolve(data);
      })
  })
}

export async function dbCreateListing(id: string, categoryid: string, subcategoryid:string, title: string, description: string, price: number, imgs: string[]): Promise<Listing> {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3014/api/v0/listing', {
      method: 'POST',
      body: JSON.stringify({"id": id, "categoryid": categoryid, "subcategoryid": subcategoryid, "title": title, "description": description, "price": price, "imgs": imgs}),
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
      .then((data: Listing) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
}

export async function dbGetListing(listingID: string): Promise<Listing> {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3014/api/v0/listing/get/${listingID}`, {
      method: 'GET',
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
      .then((data: Listing) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
}

// export async function dbUpdateListing(listing: Listing): Promise<Listing> {
//   return new Promise((resolve, reject) => {
//     const select = `UPDATE Listings SET data = jsonb_set(data, '{msg}', '"${listing.data}"'::jsonb) WHERE id = $1`;
//     const query = {
//       text: select,
//       values: [listing.listingid],
//     };
//     pool.query(query)
//       .then((res) => {
//         res.rows.length==1 ? resolve(res.rows[0]) : reject(new Error('DeleteListing Error'));
//       });
//   })
// }

export async function dbDeleteListing(listingID: string, userID: string, roles: string[]): Promise<Listing> {
  console.log('-> ', JSON.stringify({"listingID": listingID, "userID": userID, "roles": roles}))
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3014/api/v0/listing', {
      method: 'DELETE',
      body: JSON.stringify({"listingID": listingID, "userID": userID, "roles": roles}),
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
      .then((data: Listing) => {
        resolve(data);
      })
      .catch((error: Error) => {
        console.error(error);
        reject(error);
      })
  })
}