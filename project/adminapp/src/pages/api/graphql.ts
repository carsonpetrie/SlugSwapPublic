/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { createYoga } from 'graphql-yoga';
import 'reflect-metadata'; // must come before buildSchema
import { buildSchemaSync } from 'type-graphql';

import { nextAuthChecker } from '../../graphql/auth/checker';
// import { UserResolver } from '../../graphql/user/resolver';
import { AuthResolver } from '../../graphql/auth/resolver';
import { CategoryResolver } from '../../graphql/categories/resolver';
import { UserResolver } from '../../graphql/users/resolver';

const schema = buildSchemaSync({
  resolvers: [
    AuthResolver,
    CategoryResolver,
    UserResolver,
  ],
  validate: true, 
  authChecker: nextAuthChecker,
});

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
})
