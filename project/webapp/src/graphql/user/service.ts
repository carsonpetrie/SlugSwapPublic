/*
#######################################################################
#
# Copyright (C) 2022-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { User, UserInput, UserData, UserDataInput, deleteUser } from "./schema";
import { dbCreateUser, dbGetUsers, dbGetUser, dbEditUserData, dbDeleteUser } from "./userDB";

export class UserService {
  public async createUser(newUser: UserInput): Promise<User>  {
    const {email, password, name} = newUser;
    return dbCreateUser(email, password, name)
  }

  public async getUsers(): Promise<User[]> {
    return dbGetUsers();
  }

  public async getUser(userid: string): Promise<UserData>  {
    return dbGetUser(userid);
  }

  public async editUserData(input: UserDataInput, userid:string): Promise<UserData>  {
    return dbEditUserData(input, userid);
  }

  public async deleteUser(deleteUser: deleteUser, currid: string): Promise<User>  {
    const {userid} = deleteUser;
    return dbDeleteUser(userid, currid);
  }



}
