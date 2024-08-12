import { 
  Resolver, 
  Mutation, 
  Arg, 
  Query,  
  Authorized 
} from "type-graphql"
import { UserService } from "./service";
import { User, 
  UserID, 
} from "./schema";

@Resolver()
export class UserResolver {

  @Authorized(["admin"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(() => [User])
  async GetUsers(): Promise<User[]> {
    return new UserService().getUsers();
  }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @Query(() => UserData)
  // async GetUser(
  //   @Args() { userid }: UserID
  // ): Promise<UserData> {
  //   return new UserService().getUser(userid);
  // }

  @Authorized(["admin"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(() => User)
  async enableUser(
    @Arg("input") userInput: UserID,
  ): Promise<UserID> {
    return new UserService().enableUser(userInput.userid);
  }


  @Authorized(["admin"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(() => User)
  async disableUser(
    @Arg("input") userInput: UserID,
  ): Promise<UserID> {
    return new UserService().disableUser(userInput.userid);
  }

}
