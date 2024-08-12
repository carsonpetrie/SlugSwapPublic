import { Message, MessageInput } from "./types";
import { dbCreateMessage } from './db';

export class MessageService {

  public async sendMessage({chatID, requesterID, message}: MessageInput): Promise<Message> {
    return dbCreateMessage(chatID, requesterID, message);
  }

}