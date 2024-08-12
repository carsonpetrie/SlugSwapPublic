import { Query, Resolver, Args, Authorized } from "type-graphql";

import { Credentials, UserSession } from "./schema";
import { AuthService } from "./service";

@Resolver()
export class AuthResolver {
  @Query(() => UserSession)
  async Login(
    @Args() credentials: Credentials,
  ): Promise<UserSession> {
    return new AuthService().login(credentials);
  }

  @Query(() => String)
  @Authorized(['member'])
  async Check(): Promise<string>{
    return 'Your JWT is still valid';
  }
}
