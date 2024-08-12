

# Install everything (note plural "installs")
`$ npm run installs`

If running the production build, you can just call:
`$ npm run containerised`

Otherwise, follow steps below for the `dev` build.

# Create `.env` file in `AccountService`, `CategoryService`, `ListingService`, `MessageService`, `adminapp`, `modapp`, and `webapp`
```
POSTGRES_DB=dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

# Create `.env` file in `AuthService` with contents
```
JWT_SECRET_KEY=WHATEVER
```

# Create `.env.test` file in ``modapp` and `webapp`
```
POSTGRES_DB=test
```

# Starts all databases
`$ npm run docker-up`

# Stops all databases
`$ npm run docker-down`

# Starts all development servers
`$ npm run dev`

# Starts tests
`$ npm run tests`

