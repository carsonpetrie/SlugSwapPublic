import { Resolver, Query, Mutation, Ctx, Arg, Authorized } from "type-graphql"
import { ListingService } from "./service";
import { Listing, ListingInput, ListingID, ListingTitle, ListingPoster, ListingCategory, ListingSubCategory, ListingAttributes} from "./schema";
import type { YogaContext } from "graphql-yoga";

@Resolver()
export class ListingResolver {
  @Query(() => [Listing])
  async GetListings(
    @Arg("listingTitle", { nullable: true }) listingTitle: ListingTitle,
    @Arg("listingCategory", { nullable: true }) listingCategory: ListingCategory,
    @Arg("listingSubCategory", { nullable: true }) listingSubCategory: ListingSubCategory,
    @Arg("listingAttributes", { nullable: true }) listingAttributes: ListingAttributes,
  ): Promise<Listing[]> {
    if (listingCategory?.category === 'All') {
      return new ListingService().getListings(listingTitle?.title);
    } else {
      return new ListingService().getListings(listingTitle?.title, listingCategory?.category, listingSubCategory?.subcategory, listingAttributes?.attributes);
    }
  }

  @Query(() => [Listing])
  async GetListingsByPoster(
    @Arg("listingPoster") listingPoster: ListingPoster,
  ): Promise<Listing[]> {
    return new ListingService().getListingsByPoster(listingPoster.posterid);
  }

  @Authorized(['member'])
  @Mutation(() => Listing)
  async CreateListing(
    @Ctx() request: YogaContext,
    @Arg("input") input: ListingInput,
  ): Promise<Listing> {
    console.log(input);
    return new ListingService().createListing(request.user.userid, input);
  }

  @Query(() => Listing)
  async GetListing(
    @Arg("listingID") listingID: ListingID,
  ): Promise<Listing> {
    return new ListingService().getListing(listingID.listingid);
  }

  @Authorized(['member'])
  @Mutation(() => Listing)
  async DeleteListing(
    @Ctx() request: YogaContext,
    @Arg("input") listingID: ListingID,
  ): Promise<Listing> {
    return new ListingService().deleteListing(listingID.listingid, request.user.userid, request.user.roles);
  }
}
