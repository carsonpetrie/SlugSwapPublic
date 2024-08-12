import { ParsedUrlQuery } from "querystring"

export type SessionUser = {
  userid: string,
  name: string,
  roles: string[],
}

export interface RouteInfo {
  pathname: string, 
  query: ParsedUrlQuery
} 
