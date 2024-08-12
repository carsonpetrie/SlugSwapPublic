import { pool } from '../db';
import { Chat, UUID } from './types';
import { Message } from '../message/types';

// CREATE TABLE Chat (chatID UUID PRIMARY KEY DEFAULT gen_random_uuid(), listingID UUID, ownerID UUID, inquirerID UUID, data jsonb);
export async function dbCreateChat(listingID: UUID, ownerID: UUID, inquirerID: UUID): Promise<{chatid: UUID}> {
  return new Promise((resolve) => {
    const insert =
      `With s AS ( ` +
        `SELECT chatID FROM Chats WHERE listingID=$1 AND inquirerID=$3 ` +
      `), ` +
      `i AS ( ` +
        `INSERT INTO Chats(listingID, ownerID, inquirerID, data) ` +
        `SELECT $1, $2, $3, jsonb_build_object('createdAt', now()) || jsonb_build_object('lastUsed', now()) ` +
        `WHERE NOT EXISTS (SELECT * FROM Chats WHERE listingID=$1 AND inquirerID=$3) ` +
        `RETURNING chatID ` +
      `) ` +
      `SELECT chatID FROM i ` +
      `UNION ALL ` +
      `SELECT chatID FROM s`;
      
    const query = {
      text: insert,
      values: [listingID, ownerID, inquirerID]
    }

    pool.query(query).then((res) => {
      resolve(res.rows[0])
    });
  })
}

export async function dbGetChats(requesterID: UUID): Promise<Chat[]> {
  const select = 
    `SELECT * FROM Chats WHERE ownerID = $1 OR inquirerID=$1 ORDER BY data->>'lastUsed' DESC`;
  const query = {
    text: select,
    values: [requesterID]
  }
  const {rows} = await pool.query(query);
  return rows;
}

export async function dbGetChatInfo(chatID: UUID, requesterID: UUID): Promise<Chat> {
  return new Promise((resolve, reject) => {
    const select =
      `SELECT * From Chats WHERE chatID=$1 AND (ownerID=$2 OR inquirerID=$2)`
    const query = {
      text: select,
      values: [chatID, requesterID]
    }
    pool.query(query)
      .then((res) => {
        return res.rows.length===1 ? resolve(res.rows[0]) : reject(new Error('Invalid id or you are not a participant of this chat'));
      })
  })
}

export async function dbGetChatHistory(chatID: UUID, requesterID: UUID): Promise<Message[]> {
  const select = 
    `SELECT * FROM Messages WHERE chatID = $1 AND EXISTS (SELECT * From Chats WHERE chatID=$1 AND (ownerID=$2 OR inquirerID=$2)) ORDER BY data->>'sentAt' DESC`;
  const query = {
    text: select,
    values: [chatID, requesterID]
  }
  const {rows} = await pool.query(query);
  return rows;
}
