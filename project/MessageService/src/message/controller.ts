import {
  Body,
  Controller,
  Post,
  Route,
  Res,
  TsoaResponse,
} from 'tsoa';

import { Message, MessageInput } from './types';
import { MessageService } from './service';

@Route('message')
export class MessageController extends Controller {
  @Post('send')
  public async sendMessage(
    @Body() message: MessageInput,
    @Res() BadResponse: TsoaResponse<400, { reason: string }>,
  ): Promise<Message> {
    return new MessageService().sendMessage(message)
      .then((res: Message) => {
        return res;
      }, (error: Error) => {
        return BadResponse(400, {reason: error.message})
      })
  }

}