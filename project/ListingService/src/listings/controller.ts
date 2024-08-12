import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Route,
  Put,
  Res,
  TsoaResponse,
  Query,
  Path,
} from 'tsoa';

import { ListingID, Listing, NewListing, DeleteRequest, UUID, ListingQuery } from '.'; 
import { ListingService } from './service';

@Route('listing')
export class ListingController extends Controller {

  @Post('get')
  public async GetListings(
    @Body() query: ListingQuery,
  ): Promise<Listing[]> {
    return new ListingService().getListings(query.searchValue, query.category, query.subcategory, query.attributes);
  }

  @Get('poster')
  public async GetPostersListings(
    @Query() posterid?: string,
  ): Promise <Listing[]> {
    return new ListingService().getPostersListings(posterid);
  }

  @Post('')
  public async CreateListing(
    @Res() UnauthorizedResponse: TsoaResponse<401, { reason: string }>,
    @Body() n: NewListing
  ): Promise <Listing> {
    return new ListingService().createListing(n.id, n.categoryid, n.subcategoryid, n.title, n.description, n.price, n.imgs);
  }

  @Get('get/{listingID}')
  public async GetListing(
    @Res() ErrorResponse: TsoaResponse<404, { reason: string }>,
    @Path() listingID: UUID,
  ): Promise <Listing> {
    return new ListingService().getListing(listingID)
      .then(
        (listing: Listing) => {
          return listing;
        },
        (error: Error) => {
          return ErrorResponse(404, { reason: error.message });
        }
      );  
  }

  @Delete('')
  public async DeleteListing(
    @Res() UnauthorizedResponse: TsoaResponse<401, { reason: string }>,
    @Body() deleteRequest: DeleteRequest,
  ): Promise <Listing> {
    return new ListingService().deleteListing(deleteRequest.listingID, deleteRequest.userID, deleteRequest.roles)
      .then(
        (listing: Listing) => {
          return listing;
        },
        (error: Error) => {
          return UnauthorizedResponse(401, { reason: error.message });
        }
      );  
  }

  @Get('pending')
  public async GetPendingListings(): Promise<Listing[]> {
    console.log('here');
    return new ListingService().getPendingListings();
  }

  @Put('approve')
  public async ApprovePendingListing(
    @Res() ErrorResponse: TsoaResponse<404, { reason: string }>,
    @Body() listingID: ListingID
  ): Promise<Listing> {
    return new ListingService().approvePendingListing(listingID.id)
      .then(
        (listing: Listing) => {
          return listing;
        },
        (error: Error) => {
          return ErrorResponse(404, { reason: error.message });
        }
      )
  }

  @Put('flag')
  public async FlagListing(
    @Res() ErrorResponse: TsoaResponse<404, { reason: string }>,
    @Body() listingID: ListingID
  ): Promise<Listing> {
    return new ListingService().flagListing(listingID.id)
      .then(
        (listing: Listing) => {
          return listing;
        },
        (error: Error) => {
          return ErrorResponse(404, { reason: error.message });
        }
      )
  }
}