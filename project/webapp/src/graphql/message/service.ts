import { dbCreateChat, dbGetChatHistory, dbGetChatInfo, dbGetChats, dbSendMessage } from "./messageDB";
import { Chat, chatID, Message } from "./schema";

export class MessageService {
  public async createChat(requesterID: string, listingID: string): Promise<chatID> {
    return dbCreateChat(requesterID, listingID);
  }

  public async getChats(requesterID: string): Promise<Chat[]> {
    return dbGetChats(requesterID);
  }

  public async getChatInfo(requesterID: string, chatID: string): Promise<Chat> {
    return dbGetChatInfo(requesterID, chatID);
  }

  public async getChatHistory(requesterID: string, chatID: string): Promise<Message[]> {
    return dbGetChatHistory(requesterID, chatID);
  }

  public async sendMessage(requsterID: string, chatID: string, message: string): Promise<Message> {
    return dbSendMessage(requsterID, chatID, message);
  }
}