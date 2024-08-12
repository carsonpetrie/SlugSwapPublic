import { Resolver, Mutation, Arg, Query, Args, Authorized, Ctx } from "type-graphql"
import { UserService } from "./service";
import { User, UserID, UserInput, UserData, UserDataInput, deleteUser} from "./schema";
import type { YogaContext } from "graphql-yoga";

@Resolver()
export class UserResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => User)
  async SignUp(
    @Arg("input") input: UserInput,
  ): Promise<User> {
    return new UserService().createUser(input);
  } 

  @Authorized(["admin"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => [User])
  async GetUsers(): Promise<User[]> {
    return new UserService().getUsers();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => UserData)
  async GetUser(
    @Args() { userid }: UserID
  ): Promise<UserData> {
    return new UserService().getUser(userid);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => UserData)
  async EditUserData(
    @Arg("input") input: UserDataInput,
    @Ctx() request: YogaContext,
  ): Promise<UserData> {
    return new UserService().editUserData(input, request.user.userid);
  }

  @Authorized(["admin"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => User)
  async deleteUser(
    @Ctx() request: YogaContext,
    @Arg("input") input: deleteUser,
  ): Promise<User> {
    
    return new UserService().deleteUser(input, request.user.userid);
  }

}
