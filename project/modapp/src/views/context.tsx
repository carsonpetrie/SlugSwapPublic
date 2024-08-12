import { UserSession } from "@/graphql/auth/schema";
import { createContext } from "react";

export interface UserContext {
  loginDetails?: UserSession;
  setLoginDetails: (session: UserSession|undefined) => void;
}

export const UserContext = createContext<UserContext|undefined>(undefined);