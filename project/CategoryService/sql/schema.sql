DROP COLLATION IF EXISTS case_insensitive CASCADE;
CREATE COLLATION case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);

-- Categories
DROP TABLE IF EXISTS SubCategories CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
CREATE TABLE Categories (categoryID VARCHAR(128) PRIMARY KEY, data jsonb);
CREATE TABLE SubCategories (subcategoryID VARCHAR(128) PRIMARY KEY, categoryID VARCHAR(128) REFERENCES Categories (categoryID) ON DELETE CASCADE ON UPDATE CASCADE, attributes jsonb);
