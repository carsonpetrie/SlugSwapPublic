import { Listing } from "./schema";
import { dbGetPendingListings, dbApproveListing, dbGetApprovedListings, dbFlagListing } from "./listingDB";

export class ListingService {

  public async getPendingListings(): Promise<Listing[]> {
    return dbGetPendingListings();
  }

  public async getApprovedListings(): Promise<Listing[]> {
    return dbGetApprovedListings();
  }

  public async approveListing(listingID: string): Promise<Listing> {
    return dbApproveListing(listingID);
  }

  public async flagListing(listingID: string): Promise<Listing> {
    return dbFlagListing(listingID);
  }
}