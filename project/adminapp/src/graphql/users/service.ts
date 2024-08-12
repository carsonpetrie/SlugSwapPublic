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

import { User, UserID } from "./schema";
import {dbGetUsers, dbEnableUser, dbDisableUser } from "./userDB";

export class UserService {
  public async getUsers(): Promise<User[]> {
    return dbGetUsers();
  }

  // public async getUser(userid: string): Promise<UserData>  {
  //   return dbGetUser(userid);
  // }

  public async  enableUser(userid: string): Promise<UserID> {
    return dbEnableUser(userid);
  }

  public async disableUser(userid: string): Promise<UserID> {
    return dbDisableUser(userid);
  }

}
