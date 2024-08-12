/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern ^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

export interface ListingID {
  id: UUID,
}

export interface ListingQuery {
  searchValue?: string,
  category?: string,
  subcategory?: string,
  attributes?: string,
}

export interface ListingData {
  title: string,
  imgs: string[],
  description: string,
  dateCreated: string,
  price: number,
  pending: string,
}

export interface Listing {
  listingid: UUID,
  posterid: UUID,
  categoryid: string,
  data: ListingData,
}

export interface NewListing {
  id: UUID,
  categoryid: string,
  subcategoryid: string,
  title: string,
  description: string,
  price: number,
  imgs: string[],
}

export interface DeleteRequest {
  listingID: UUID,
  userID: UUID,
  roles: string[],
}