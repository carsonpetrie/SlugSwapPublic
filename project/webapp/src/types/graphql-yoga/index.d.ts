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

import { SessionUser } from "../custom";
import { YogaInitialContext } from "graphql-yoga";

declare module 'graphql-yoga' {
  export interface YogaContext extends YogaInitialContext {
    user: SessionUser;
  }
}

export {}
