DROP TABLE IF EXISTS Chats CASCADE;
CREATE TABLE Chats (chatID UUID PRIMARY KEY DEFAULT gen_random_uuid(), listingID UUID, ownerID UUID, inquirerID UUID, data jsonb, UNIQUE(listingID, inquirerID));

-- Messages
DROP TABLE IF EXISTS Messages CASCADE;
CREATE TABLE Messages (messageID UUID PRIMARY KEY DEFAULT gen_random_uuid(), senderID UUID NOT NULL, chatID UUID NOT NULL, data jsonb, FOREIGN KEY (chatID) REFERENCES Chats(chatID) ON DELETE CASCADE);
