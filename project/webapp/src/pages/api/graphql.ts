import { createYoga } from 'graphql-yoga';
import 'reflect-metadata'; // must come before buildSchema
import { buildSchemaSync } from 'type-graphql';

import { nextAuthChecker } from '../../graphql/auth/checker';
import { UserResolver } from '../../graphql/user/resolver';
import { AuthResolver } from '../../graphql/auth/resolver';
import { ListingResolver } from '../../graphql/listing/resolver';
import { CategoryResolver } from '../../graphql/categories/resolver';
import { MessageResolver } from '../../graphql/message/resolver';
import { NextApiRequest, NextApiResponse } from 'next';
import { createFetch } from '@whatwg-node/fetch';

const schema = buildSchemaSync({
  resolvers: [
    UserResolver,
    AuthResolver,
    ListingResolver,
    CategoryResolver,
    MessageResolver,
  ],
  validate: { forbidUnknownValues: false }, 
  authChecker: nextAuthChecker,
});

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}> ({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
  fetchAPI: createFetch({
    formDataLimits: {
      // Maximum allowed file size (in bytes)
      fileSize: 3 * 1024 * 1024,
      // Maximum allowed number of files
      files: 5,
    }
  }),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

