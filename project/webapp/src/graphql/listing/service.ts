import { Listing, ListingInput } from "./schema";
import {FormData, fetch} from '@whatwg-node/fetch';
import { dbGetListings, dbGetListing, dbCreateListing, dbDeleteListing, dbGetListingsByPoster } from "./listingDB";


export class ListingService {
  public async getListings(searchValue?: string, category?: string, subcategory?: string, attributes?:string): Promise<Listing[]> {
    return dbGetListings(searchValue, category, subcategory, attributes);
  }

  public async getListingsByPoster(posterID?: string): Promise<Listing[]> {
    return dbGetListingsByPoster(posterID);
  }

  public async getListing(listingID: string): Promise<Listing> {
    return dbGetListing(listingID);
  }

  public async createListing(posterID: string, newListing: ListingInput): Promise<Listing>  {
    const imgs:string[] = [];
    const {categoryid, subcategoryid, title, description, price, images} = newListing;
    const promiseToRuleThemAll = await Promise.allSettled(
      images.map(image => this.postListingImage(image))
    )
    promiseToRuleThemAll.forEach((res) => {
      if(res.status==='fulfilled') {
        imgs.push(res.value)
      }
    });
    return dbCreateListing(posterID, categoryid, subcategoryid, title, description, parseFloat(price.toFixed(2)), imgs);
  }

  public async deleteListing(listingID: string, userID: string, roles: string[]): Promise<Listing>  {
    return dbDeleteListing(listingID, userID, roles);
  }

  private async postListingImage(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const imageForm = new FormData();
      imageForm.append('image', image);
      fetch("http://localhost:3011/api/v0/image/listing", {
        method: 'POST',
        headers: {
          "accept": "application/json",
        },
        body: imageForm,
      })
        .then((res) => {
          if(!res.ok) {
            throw new Error(`${res.status}`)
          } else {
            return res.json();
          }
        })
        .then((json) => {
          resolve(json.fileName);
        })
        .catch((err) => {
          reject(err.message);
        })
    });
  }

}
