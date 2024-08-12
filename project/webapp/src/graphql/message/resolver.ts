import type { YogaContext } from "graphql-yoga";
import { Query, Resolver, Args, Authorized, Mutation, Ctx } from "type-graphql";

import { MessageInput, ChatRequest, Message, chatID, InitChat, Chat, } from "./schema";
import { MessageService } from "./service";

@Resolver()
export class MessageResolver {
  @Authorized(['member'])
  @Mutation(() => chatID)
  async CreateChat(
    @Ctx() request: YogaContext,
    @Args() {listingID}: InitChat,
  ): Promise<chatID> {
    return new MessageService().createChat(request.user.userid, listingID);
  }
  
  @Authorized(['member'])
  @Query(() => [Chat])
  async GetChats(
    @Ctx() request: YogaContext,
  ): Promise<Chat[]> {
    return new MessageService().getChats(request.user.userid);
  }

  @Authorized(['member'])
  @Query(() => Chat)
  async GetChatInfo(
    @Ctx() request: YogaContext,
    @Args() {chatID}: ChatRequest,
  ): Promise<Chat> {
    return new MessageService().getChatInfo(request.user.userid, chatID);
  }

  @Authorized(['member'])
  @Query(() => [Message])
  async GetChatHistory(
    @Ctx() request: YogaContext,
    @Args() {chatID}: ChatRequest,
  ): Promise<Message[]> {
    return new MessageService().getChatHistory(request.user.userid, chatID);
  }

  @Authorized(['member'])
  @Mutation(() => Message)
  async SendMessage(
    @Ctx() request: YogaContext,
    @Args() {chatID, message}: MessageInput,
  ): Promise<Message> {
    return new MessageService().sendMessage(request.user.userid, chatID, message);
  }

}
