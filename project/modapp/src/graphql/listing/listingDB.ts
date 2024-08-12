import {Listing} from './schema';

export async function dbGetPendingListings(): Promise<Listing[]> {
  return new Promise((resolve) => {
    fetch(`http://localhost:3014/api/v0/listing/pending`, {
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

export async function dbGetApprovedListings(): Promise<Listing[]> {
  return new Promise((resolve) => {
    fetch(`http://localhost:3014/api/v0/listing/get`, {
      method: 'POST',
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

export async function dbApproveListing(listingID: string): Promise<Listing> {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3014/api/v0/listing/approve`, {
      method: 'PUT',
      body: JSON.stringify({"id": listingID}),
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
        reject(error);
      })
  })
}

export async function dbFlagListing(listingID: string): Promise<Listing> {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3014/api/v0/listing/flag`, {
      method: 'PUT',
      body: JSON.stringify({"id": listingID}),
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
        console.log(data);
        resolve(data);
      })
      .catch((error: Error) => {
        reject(error);
      })
  })
}