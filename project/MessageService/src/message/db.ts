import { pool } from '../db';
import { Message, UUID } from './types';

// CREATE TABLE Messages (messageID UUID PRIMARY KEY DEFAULT gen_random_uuid(), senderID UUID NOT NULL, chatID UUID NOT NULL, data jsonb, FOREIGN KEY (chatID) REFERENCES Chat(chatID) ON DELETE CASCADE);
export async function dbCreateMessage(chatID: UUID, senderID: UUID, message: string): Promise<Message> {
  return new Promise((resolve, reject) => {
    const insert =
      `INSERT INTO Messages(chatID, senderID, data) ` +
      `SELECT $1, $2, $3::jsonb || jsonb_build_object('sentAt', now()) ` +
      `WHERE EXISTS (SELECT * From Chats WHERE chatID=$1 AND (ownerID=$2 OR inquirerID=$2)) ` +
      `RETURNING *`;
    const query = {
      text: insert,
      values: [chatID, senderID, {message}]
    }
    pool.query(query)
      .then((res) => {
        return res.rows.length===1 ? resolve(res.rows[0]) : reject(new Error('Invalid id or you are not a participant of this chat'));
      })
  })
}
