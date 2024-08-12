import { AuthChecker } from "type-graphql";

import type {YogaContext} from "graphql-yoga";

import { AuthService } from "./service";

async function authChecker(context: YogaContext, authHeader: string|null, roles: string[]): Promise<boolean>
{
  return await new AuthService().check(authHeader, roles)
    .then(
      (res) => {context.user=res; return true;}, // resolved
      () => {return false;} // rejected
    );
}

export const nextAuthChecker: AuthChecker<YogaContext> = async (
  { context }, roles) => 
{
  return await authChecker(context, context.request.headers.get("authorization"), roles)
};