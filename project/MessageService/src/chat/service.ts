import { Chat, ChatRequest, InitChat, UUID } from "./types";
import { dbCreateChat, dbGetChatHistory, dbGetChatInfo, dbGetChats } from './db';
import { Message } from "../message/types";

export class ChatService {
  public async createChat({listingID, inquirerID}: InitChat): Promise<{chatid: UUID}> {
    return new Promise((resolve, reject) => {
      this.fetchOwnerID(listingID)
        .then((ownerID) => {
          if (inquirerID===ownerID) {
            return reject(new Error(`You can't chat with yourself!`));
          }
          dbCreateChat(listingID, ownerID, inquirerID)
            .then((res) => {
              resolve(res);
            })
        }, (err: Error) => {
          reject(err)
        });
    })
  }

  private async fetchOwnerID(listingID: UUID): Promise<UUID> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3014/api/v0/listing/get/${listingID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
          }
          return res.json();
        })
        .then(({posterid}) => {
          resolve(posterid);
        })
        .catch((error: Error) => {
          reject(error);
        })
    })
  }

  public async getChats({requesterID}: {requesterID: UUID}): Promise<Chat[]> {
    return dbGetChats(requesterID);
  }

  public async getChatInfo({chatID, requesterID}: ChatRequest): Promise<Chat> {
    return dbGetChatInfo(chatID, requesterID);
  }

  public async getChatHistory({chatID, requesterID}: ChatRequest): Promise<Message[]> {
    return dbGetChatHistory(chatID, requesterID)
  }

}