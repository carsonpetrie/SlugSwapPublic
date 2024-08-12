import { UserSession } from "@/graphql/auth/schema";
import { createContext } from "react";

export interface UserContext {
  loginDetails?: UserSession;
  setLoginDetails: (session: UserSession|undefined) => void;
}

// export interface CategoryContext {
//   currentCategory: string;
//   setCurrentCategory: (category: string) => void;
// }

// export interface SearchContext {
//   currentSearch?: string;
//   setCurrentSearch: (search: string|undefined) => void;
// }

export interface MenuContext {
  currentMenu?: string;
  setCurrentMenu: (menu: string) => void;
}

export const UserContext = createContext<UserContext|undefined>(undefined);
// export const CategoryContext = createContext<CategoryContext|undefined>(undefined);
// export const SearchContext = createContext<SearchContext|undefined>(undefined);
export const MenuContext = createContext<MenuContext|undefined>(undefined);