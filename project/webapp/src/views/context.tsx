import { UserSession } from "@/graphql/auth/schema";
import { RouteInfo } from "../types/custom";
import { createContext } from "react";

export interface UserContext {
  loginDetails?: UserSession;
  setLoginDetails: (session: UserSession|undefined) => void;
}

export interface CategoryContext {
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

export interface SearchContext {
  currentSearch?: string;
  setCurrentSearch: (search: string|undefined) => void;
}

export interface RouteContext {
  currentRoute: RouteInfo;
  setCurrentRoute: (route: RouteInfo) => void;
}

export const UserContext = createContext<UserContext|undefined>(undefined);
export const CategoryContext = createContext<CategoryContext|undefined>(undefined);
export const SearchContext = createContext<SearchContext|undefined>(undefined);
export const RouteContext = createContext<RouteContext|undefined>(undefined);