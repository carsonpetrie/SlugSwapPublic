import {
  Body,
  Controller,
  Post,
  Route,
  Res,
  TsoaResponse,
} from 'tsoa';

import { InitChat, Chat, UUID, ChatRequest } from './types';
import { Message } from '../message/types';
import { ChatService } from './service';

@Route('chat')
export class ChatController extends Controller {
  @Post('createChat')
  public async createChat (
    @Body() chat: InitChat,
    @Res() BadRequestResponse: TsoaResponse<400, { reason: string }>,
  ): Promise<{chatid: UUID}> {
    return new ChatService().createChat(chat)
      .then((res) => {
        return res;
      }, (error: Error) => {
        return BadRequestResponse(400, {reason: error.message});
      });
  }

  @Post('getChats')
  public async getChats (
    @Body() requester: {requesterID: UUID}
  ): Promise<Chat[]> {
    return new ChatService().getChats(requester);
  }

  @Post('getChatInfo')
  public async getChatInfo (
    @Body() chat: ChatRequest,
    @Res() BadRequestResponse: TsoaResponse<400, { reason: string }>,
  ): Promise<Chat> {
    return new ChatService().getChatInfo(chat)
      .then((res: Chat) => {
        return res;
      }, (error: Error) => {
        return BadRequestResponse(400, {reason: error.message});
      });
  }

  @Post('history')
  public async getChatHistory(
    @Body() request: ChatRequest, 
  ): Promise<Message[]> {
    return new ChatService().getChatHistory(request);
  }

}