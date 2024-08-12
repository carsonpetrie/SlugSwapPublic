DROP COLLATION IF EXISTS case_insensitive CASCADE;
CREATE COLLATION case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);

-- Listings
DROP TABLE IF EXISTS Listings CASCADE;
CREATE TABLE Listings (listingID UUID PRIMARY KEY DEFAULT gen_random_uuid(), posterID UUID NOT NULL, categoryID VARCHAR(128) NOT NULL, subcategoryID VARCHAR(128), data jsonb, attributes jsonb);
