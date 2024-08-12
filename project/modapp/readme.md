# Install dependencies
`$ npm run install`

# Create `.env` (REQUIRED FOR DEVELOPMENT)
```
POSTGRES_DB=dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres```

# Create `.env.test` (REQUIRED FOR RUNNING TESTS)
```
POSTGRES_DB=test
```

# Starts database
`$ npm run docker-up`

# Stops database
`$ npm run docker-up`

# Starts server
`$ npm run dev`

# Starts tests
`$ npm run test`

# Start server in production mode
`$ npm run start`
