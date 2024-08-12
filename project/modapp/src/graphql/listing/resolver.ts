import { Query, Mutation, Arg, Resolver, Authorized } from "type-graphql"
import { Listing, ListingID } from "./schema";
import { ListingService } from "./service";

@Resolver()
export class ListingResolver {

  @Authorized(['moderator'])
  @Query(() => [Listing])
  async GetPendingListings (): Promise<Listing[]> {
    return new ListingService().getPendingListings();
  }

  @Authorized(['moderator'])
  @Query(() => [Listing])
  async GetApprovedListings (): Promise<Listing[]> {
    return new ListingService().getApprovedListings();
  }

  @Authorized(['moderator'])
  @Mutation(() => Listing)
  async ApproveListing(
    @Arg("input") listingID: ListingID,
  ): Promise<Listing> {
    return new ListingService().approveListing(listingID.listingid);
  }

  @Authorized(['moderator'])
  @Mutation(() => Listing)
  async FlagListing(
    @Arg("input") listingID: ListingID,
  ): Promise<Listing> {
    return new ListingService().flagListing(listingID.listingid);
  }
}

