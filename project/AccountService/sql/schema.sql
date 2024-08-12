DROP COLLATION IF EXISTS case_insensitive CASCADE;
CREATE COLLATION case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);

-- Users
DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users (userID UUID PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE COLLATE case_insensitive NOT NULL, password TEXT NOT NULL, data jsonb);
