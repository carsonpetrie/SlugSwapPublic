-- Categories
INSERT INTO Categories(categoryID) VALUES ('Apparel');
INSERT INTO Categories(categoryID) VALUES ('Computers');
INSERT INTO Categories(categoryID) VALUES ('Games & Hobbies');
INSERT INTO Categories(categoryID) VALUES ('Home Goods');
INSERT INTO Categories(categoryID) VALUES ('Vehicles');

INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Men''s Clothing', 'Apparel', '{"ATTRIBUTES": [{"name": "Color", "type": "ENUM", "contents": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Grey", "Black", "White"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Women''s Clothing', 'Apparel', '{"ATTRIBUTES": [{"name": "Color", "type": "ENUM", "contents": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Grey", "Black", "White"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Kid''s Clothing', 'Apparel', '{"ATTRIBUTES": [{"name": "Color", "type": "ENUM", "contents": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Grey", "Black", "White"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Baby Clothes', 'Apparel', '{"ATTRIBUTES": [{"name": "Color", "type": "ENUM", "contents": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Grey", "Black", "White"]}]}');

INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Board Games', 'Games & Hobbies');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Books', 'Games & Hobbies');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Puzzles', 'Games & Hobbies');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Toys', 'Games & Hobbies');

INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Appliances', 'Home Goods');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Artwork', 'Home Goods');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Furniture', 'Home Goods');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Plants', 'Home Goods');

INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Cars & Trucks', 'Vehicles', '{"ATTRIBUTES": [{"name": "Make", "type": "ENUM", "contents": ["Audi", "BMW", "Bugatti", "Cadillac", "Dodge", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Nissan", "Subaru", "Toyota", "Tesla"]}, {"name": "Transmission", "type": "ENUM", "contents": ["Automatic", "Manual"]}, {"name": "Color", "type": "ENUM", "contents": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Grey", "Black", "White"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Motorcycles', 'Vehicles');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Campers & RVs', 'Vehicles');
INSERT INTO SubCategories(subcategoryID, categoryID) VALUES ('Boats & Marine', 'Vehicles');

INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Desktop & Laptop PCs', 'Computers', '{"ATTRIBUTES": [{"name": "Condition", "type": "ENUM", "contents": ["New", "Used", "Refurbished", "For Parts"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Computer Monitors', 'Computers', '{"ATTRIBUTES": [{"name": "Condition", "type": "ENUM", "contents": ["New", "Used", "Refurbished", "For Parts"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('Keyboards & Mice', 'Computers', '{"ATTRIBUTES": [{"name": "Condition", "type": "ENUM", "contents": ["New", "Used", "Refurbished", "For Parts"]}]}');
INSERT INTO SubCategories(subcategoryID, categoryID, attributes) VALUES ('PC Components', 'Computers', '{"ATTRIBUTES": [{"name": "Condition", "type": "ENUM", "contents": ["New", "Used", "Refurbished", "For Parts"]}]}');
